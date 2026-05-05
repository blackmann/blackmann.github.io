import { useEffect, useRef } from "react";
import {
  DARK_LED_PALETTE,
  drawIdleLedPill,
  drawLedDot,
  getLedGridMetrics,
  LED_COLUMNS,
  type LedGridMetrics,
  type LedPalette,
  LED_ROWS,
  LIGHT_LED_PALETTE,
  seededRandom,
} from "./led-screen-utils";

type RainColumn = {
  delay: number;
  length: number;
  speed: number;
  x: number;
};

type GlitchState = {
  column: number;
  startedAt: number;
  nextAt: number;
  until: number;
};

function makeColumn(random: () => number, x: number): RainColumn {
  return {
    delay: random() * LED_ROWS * 2,
    length: 3 + Math.floor(random() * 4),
    speed: 0.7 + random() * 1.5,
    x,
  };
}

function drawMatrixRain(
  context: CanvasRenderingContext2D,
  metrics: LedGridMetrics,
  columns: RainColumn[],
  palette: LedPalette,
  glitch: GlitchState,
  time: number,
) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  drawIdleLedPill(context, metrics, palette);

  for (const column of columns) {
    const head =
      Math.floor((time / 160) * column.speed + column.delay) % (LED_ROWS + column.length);

    for (let index = 0; index < column.length; index += 1) {
      const row = head - index;

      if (row < 0 || row >= LED_ROWS) {
        continue;
      }

      const fade = 1 - index / column.length;
      const alpha = Math.min(1, 0.18 + fade * 0.72);
      const radius = index === 0 ? 0.47 : 0.39;
      const color = index === 0 ? palette.head : palette.trail(alpha);

      drawLedDot(context, metrics, column.x, row, color, radius);
    }
  }

  if (time >= glitch.startedAt && time < glitch.until) {
    const head = Math.floor((time - glitch.startedAt) / 130);
    const length = 4;

    for (let index = 0; index < length; index += 1) {
      const row = head - index;

      if (row < 0 || row >= LED_ROWS) {
        continue;
      }

      const fade = 1 - index / length;
      const alpha = Math.min(1, 0.22 + fade * 0.64);
      const radius = index === 0 ? 0.47 : 0.39;
      const color = index === 0 ? palette.redHead : palette.redTrail(alpha);

      drawLedDot(context, metrics, glitch.column, row, color, radius);
    }
  }
}

export function PixelMatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const randomRef = useRef(seededRandom(42));
  const columnsRef = useRef<RainColumn[]>([]);
  const glitchRef = useRef<GlitchState>({ column: -1, nextAt: 2400, startedAt: 0, until: 0 });
  const metricsRef = useRef<LedGridMetrics>({ cellSize: 1, offsetX: 0, offsetY: 0 });
  const paletteRef = useRef<LedPalette>(LIGHT_LED_PALETTE);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    columnsRef.current = Array.from({ length: LED_COLUMNS }, (_, index) =>
      makeColumn(randomRef.current, index),
    );

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
      if (time > glitchRef.current.nextAt) {
        const startedAt = time;

        glitchRef.current = {
          column: Math.floor(randomRef.current() * LED_COLUMNS),
          nextAt: time + 5200 + randomRef.current() * 9200,
          startedAt,
          until: startedAt + LED_ROWS * 130 + 220,
        };
      }

      drawMatrixRain(
        context,
        metricsRef.current,
        columnsRef.current,
        paletteRef.current,
        glitchRef.current,
        time,
      );
      animationFrame = window.requestAnimationFrame(render);
    };

    updatePalette();
    resize();
    render(0);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    mediaQuery.addEventListener("change", updatePalette);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      mediaQuery.removeEventListener("change", updatePalette);
    };
  }, []);

  return (
    <canvas
      className="block size-full cursor-crosshair [image-rendering:pixelated]"
      onClick={() => {
        columnsRef.current = columnsRef.current.map((column) =>
          makeColumn(randomRef.current, column.x),
        );
      }}
      ref={canvasRef}
    />
  );
}
