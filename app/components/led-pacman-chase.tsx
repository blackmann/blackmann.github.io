import { useEffect, useRef } from "react";
import {
  DARK_LED_PALETTE,
  drawIdleLedPill,
  drawLedDot,
  getLedGridMetrics,
  LED_COLUMNS,
  type LedGridMetrics,
  type LedPalette,
  LIGHT_LED_PALETTE,
} from "./led-screen-utils";

type LedPacmanChaseProps = {
  onComplete: () => void;
};

const SPRITE_Y = 1;
const PELLET_ROW = 3;
const EAT_DURATION = 4300;
const CHASE_DURATION = 4200;
const PACMAN_COLOR = "rgba(250, 204, 21, 0.86)";
const PELLET_COLOR = "rgba(161, 161, 170, 0.52)";
const GHOST_COLORS = [
  "rgba(248, 113, 113, 0.78)",
  "rgba(96, 165, 250, 0.72)",
  "rgba(244, 114, 182, 0.72)",
];

function drawPacman(
  context: CanvasRenderingContext2D,
  metrics: LedGridMetrics,
  left: number,
  top: number,
  openMouth: boolean,
) {
  const shape = openMouth
    ? ["0110", "1110", "1100", "1110", "0110"]
    : ["0110", "1111", "1111", "1111", "0110"];

  for (let row = 0; row < shape.length; row += 1) {
    const line = shape[row] ?? "";

    for (let column = 0; column < line.length; column += 1) {
      if (line[column] === "1") {
        drawLedDot(context, metrics, Math.round(left) + column, top + row, PACMAN_COLOR, 0.46);
      }
    }
  }
}

function drawGhost(
  context: CanvasRenderingContext2D,
  metrics: LedGridMetrics,
  left: number,
  top: number,
  color: string,
  step: number,
) {
  const shape =
    step % 2 === 0
      ? ["0110", "1111", "1011", "1111", "1010"]
      : ["0110", "1111", "1101", "1111", "0101"];

  for (let row = 0; row < shape.length; row += 1) {
    const line = shape[row] ?? "";

    for (let column = 0; column < line.length; column += 1) {
      if (line[column] === "1") {
        drawLedDot(context, metrics, Math.round(left) + column, top + row, color, 0.43);
      }
    }
  }

  drawLedDot(context, metrics, Math.round(left) + 1, top + 1, "rgba(250, 250, 250, 0.78)", 0.22);
  drawLedDot(context, metrics, Math.round(left) + 3, top + 1, "rgba(250, 250, 250, 0.78)", 0.22);
}

function drawPellets(
  context: CanvasRenderingContext2D,
  metrics: LedGridMetrics,
  pacmanLeft: number,
  isChase: boolean,
) {
  if (isChase) {
    return;
  }

  for (let column = 7; column < LED_COLUMNS - 3; column += 2) {
    if (column > pacmanLeft + 2) {
      drawLedDot(context, metrics, column, PELLET_ROW, PELLET_COLOR, 0.24);
    }
  }
}

function drawScene(
  context: CanvasRenderingContext2D,
  metrics: LedGridMetrics,
  palette: LedPalette,
  elapsed: number,
) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  drawIdleLedPill(context, metrics, palette);

  const isChase = elapsed > EAT_DURATION;
  const eatProgress = Math.min(1, elapsed / EAT_DURATION);
  const chaseProgress = Math.max(0, Math.min(1, (elapsed - EAT_DURATION) / CHASE_DURATION));
  const pacmanLeft = isChase ? 22 + chaseProgress * 11 : 2 + eatProgress * 23;
  const mouthOpen = Math.floor(elapsed / 180) % 2 === 0;
  const ghostStep = Math.floor(elapsed / 220);

  drawPellets(context, metrics, pacmanLeft, isChase);

  if (isChase) {
    GHOST_COLORS.forEach((color, index) => {
      const ghostLeft = pacmanLeft - 4 - index * 4 + chaseProgress * 2;
      drawGhost(context, metrics, ghostLeft, SPRITE_Y, color, ghostStep + index);
    });
  }

  drawPacman(context, metrics, pacmanLeft, SPRITE_Y, mouthOpen);
}

export function LedPacmanChase({ onComplete }: LedPacmanChaseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const completedRef = useRef(false);
  const metricsRef = useRef<LedGridMetrics>({ cellSize: 1, offsetX: 0, offsetY: 0 });
  const paletteRef = useRef<LedPalette>(LIGHT_LED_PALETTE);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    let animationFrame = 0;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updatePalette = () => {
      paletteRef.current = mediaQuery.matches ? DARK_LED_PALETTE : LIGHT_LED_PALETTE;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.imageSmoothingEnabled = false;
      metricsRef.current = getLedGridMetrics(canvas);
    };

    const render = (time: number) => {
      startTimeRef.current ??= time;

      const elapsed = time - startTimeRef.current;

      drawScene(context, metricsRef.current, paletteRef.current, elapsed);

      if (!completedRef.current && elapsed > EAT_DURATION + CHASE_DURATION) {
        completedRef.current = true;
        onComplete();
        return;
      }

      animationFrame = window.requestAnimationFrame(render);
    };

    updatePalette();
    resize();
    animationFrame = window.requestAnimationFrame(render);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    mediaQuery.addEventListener("change", updatePalette);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      mediaQuery.removeEventListener("change", updatePalette);
    };
  }, [onComplete]);

  return <canvas className="block size-full [image-rendering:pixelated]" ref={canvasRef} />;
}
