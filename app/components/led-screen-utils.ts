export type LedGridMetrics = {
  cellSize: number;
  offsetX: number;
  offsetY: number;
};

export type LedPalette = {
  idle: string;
  redHead: string;
  redTrail: (alpha: number) => string;
  head: string;
  trail: (alpha: number) => string;
};

export const LED_COLUMNS = 33;
export const LED_ROWS = 8;

export const LIGHT_LED_PALETTE: LedPalette = {
  idle: "rgba(82, 98, 90, 0.16)",
  redHead: "rgba(254, 202, 202, 0.82)",
  redTrail: (alpha) => `rgba(239, 68, 68, ${Math.min(0.86, alpha * 0.92)})`,
  head: "rgba(236, 253, 245, 0.75)",
  trail: (alpha) => `rgba(34, 197, 94, ${alpha})`,
};

export const DARK_LED_PALETTE: LedPalette = {
  idle: "rgba(148, 163, 154, 0.18)",
  redHead: "rgba(252, 165, 165, 0.72)",
  redTrail: (alpha) => `rgba(248, 113, 113, ${Math.min(0.72, alpha * 0.76)})`,
  head: "rgba(187, 247, 208, 0.68)",
  trail: (alpha) => `rgba(74, 222, 128, ${Math.min(0.72, alpha * 0.78)})`,
};

export function getLedGridMetrics(canvas: HTMLCanvasElement) {
  const cellSize = canvas.width / LED_COLUMNS;

  return {
    cellSize,
    offsetX: 0,
    offsetY: (canvas.height - LED_ROWS * cellSize) / 2,
  };
}

export function isInsideLedPill(column: number, row: number) {
  const radius = LED_ROWS / 2;
  const x = column + 0.5;
  const y = row + 0.5;
  const centerY = LED_ROWS / 2;

  if (x >= radius && x <= LED_COLUMNS - radius) {
    return true;
  }

  const centerX = x < radius ? radius : LED_COLUMNS - radius;
  const dx = x - centerX;
  const dy = y - centerY;

  return dx * dx + dy * dy <= radius * radius;
}

export function drawLedDot(
  context: CanvasRenderingContext2D,
  metrics: LedGridMetrics,
  column: number,
  row: number,
  color: string,
  radiusRatio = 0.36,
) {
  if (!isInsideLedPill(column, row)) {
    return;
  }

  const centerX = metrics.offsetX + column * metrics.cellSize + metrics.cellSize / 2;
  const centerY = metrics.offsetY + row * metrics.cellSize + metrics.cellSize / 2;

  context.fillStyle = color;
  context.beginPath();
  context.arc(centerX, centerY, metrics.cellSize * radiusRatio, 0, Math.PI * 2);
  context.fill();
}

export function drawIdleLedPill(
  context: CanvasRenderingContext2D,
  metrics: LedGridMetrics,
  palette: LedPalette,
) {
  for (let row = 0; row < LED_ROWS; row += 1) {
    for (let column = 0; column < LED_COLUMNS; column += 1) {
      drawLedDot(context, metrics, column, row, palette.idle, 0.35);
    }
  }
}

export function seededRandom(seed: number) {
  let value = seed;

  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}
