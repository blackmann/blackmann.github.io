import { useEffect, useMemo, useRef } from "react";
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

type LedWelcomeTickerProps = {
  onComplete: () => void;
};

type Glyph = readonly string[];

type TickerItem =
  | {
      kind: "flag" | "robot" | "space";
      width: number;
    }
  | {
      glyph: Glyph;
      kind: "glyph";
      width: number;
    };

const CONTENT_ROW_OFFSET = 1;
const LIGHT_FOREGROUND = "rgba(113, 113, 122, 0.72)";
const DARK_FOREGROUND = "rgba(161, 161, 170, 0.68)";

const GLYPHS: Record<string, Glyph> = {
  "(": ["01", "10", "10", "10", "01"],
  ")": ["10", "01", "01", "01", "10"],
  "+": ["000", "010", "111", "010", "000"],
  "0": ["111", "101", "101", "101", "111"],
  "1": ["010", "110", "010", "010", "111"],
  "2": ["111", "001", "111", "100", "111"],
  "3": ["111", "001", "111", "001", "111"],
  "4": ["101", "101", "111", "001", "001"],
  "5": ["111", "100", "111", "001", "111"],
  "6": ["111", "100", "111", "101", "111"],
  "7": ["111", "001", "010", "010", "010"],
  "8": ["111", "101", "111", "101", "111"],
  "9": ["111", "101", "111", "001", "111"],
  ":": ["0", "1", "0", "1", "0"],
  A: ["01110", "10001", "11111", "10001", "10001"],
  C: ["01111", "10000", "10000", "10000", "01111"],
  E: ["11111", "10000", "11110", "10000", "11111"],
  L: ["10000", "10000", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10001", "10001"],
  O: ["01110", "10001", "10001", "10001", "01110"],
  R: ["11110", "10001", "11110", "10100", "10010"],
  T: ["11111", "00100", "00100", "00100", "00100"],
  U: ["10001", "10001", "10001", "10001", "01110"],
  W: ["10001", "10001", "10101", "11011", "10001"],
};

function getAccraTime() {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    timeZone: "Africa/Accra",
  }).format(new Date());
}

function makeTickerItems(time: string) {
  const items: TickerItem[] = [
    { kind: "robot", width: 6 },
    { kind: "space", width: 2 },
  ];

  for (const character of `WELCOME ${time} (ACCRA UTC+0)`) {
    if (character === " ") {
      items.push({ kind: "space", width: 2 });
      items.push({ kind: "flag", width: 6 });
      items.push({ kind: "space", width: 2 });
      continue;
    }

    const glyph = GLYPHS[character];

    if (glyph) {
      items.push({ glyph, kind: "glyph", width: glyph[0]?.length ?? 0 });
      items.push({ kind: "space", width: 1 });
    }
  }

  return items;
}

function getMessageWidth(items: TickerItem[]) {
  return items.reduce((width, item) => width + item.width, 0);
}

function drawGlyph(
  context: CanvasRenderingContext2D,
  metrics: LedGridMetrics,
  glyph: Glyph,
  left: number,
  color: string,
) {
  for (let row = 0; row < glyph.length; row += 1) {
    const line = glyph[row] ?? "";

    for (let column = 0; column < line.length; column += 1) {
      if (line[column] === "1") {
        drawLedDot(context, metrics, left + column, row + CONTENT_ROW_OFFSET, color, 0.36);
      }
    }
  }
}

function drawRobot(
  context: CanvasRenderingContext2D,
  metrics: LedGridMetrics,
  left: number,
  foreground: string,
) {
  const rows = ["00100", "11111", "10101", "11111", "01010"];

  drawGlyph(context, metrics, rows, left, foreground);
  drawLedDot(context, metrics, left + 1, 2 + CONTENT_ROW_OFFSET, foreground, 0.32);
  drawLedDot(context, metrics, left + 3, 2 + CONTENT_ROW_OFFSET, foreground, 0.32);
}

function drawGhanaFlag(
  context: CanvasRenderingContext2D,
  metrics: LedGridMetrics,
  left: number,
  foreground: string,
) {
  for (let row = 0; row <= 4; row += 1) {
    for (let column = 0; column < 5; column += 1) {
      drawLedDot(context, metrics, left + column, row + CONTENT_ROW_OFFSET, foreground, 0.35);
    }
  }

  drawLedDot(context, metrics, left + 2, 3 + CONTENT_ROW_OFFSET, foreground, 0.38);
}

function drawTickerItem(
  context: CanvasRenderingContext2D,
  metrics: LedGridMetrics,
  item: TickerItem,
  left: number,
  foreground: string,
) {
  if (item.kind === "glyph") {
    drawGlyph(context, metrics, item.glyph, left, foreground);
    return;
  }

  if (item.kind === "robot") {
    drawRobot(context, metrics, left, foreground);
    return;
  }

  if (item.kind === "flag") {
    drawGhanaFlag(context, metrics, left, foreground);
  }
}

function drawWelcomeTicker(
  context: CanvasRenderingContext2D,
  metrics: LedGridMetrics,
  items: TickerItem[],
  palette: LedPalette,
  foreground: string,
  left: number,
) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  drawIdleLedPill(context, metrics, palette);

  let cursor = Math.round(left);

  for (const item of items) {
    if (cursor < LED_COLUMNS && cursor + item.width > 0) {
      drawTickerItem(context, metrics, item, cursor, foreground);
    }

    cursor += item.width;
  }
}

export function LedWelcomeTicker({ onComplete }: LedWelcomeTickerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const metricsRef = useRef<LedGridMetrics>({ cellSize: 1, offsetX: 0, offsetY: 0 });
  const paletteRef = useRef<LedPalette>(LIGHT_LED_PALETTE);
  const foregroundRef = useRef(LIGHT_FOREGROUND);
  const completedRef = useRef(false);
  const startTimeRef = useRef<number | null>(null);
  const items = useMemo(() => makeTickerItems(getAccraTime()), []);
  const messageWidth = useMemo(() => getMessageWidth(items), [items]);

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
      foregroundRef.current = mediaQuery.matches ? DARK_FOREGROUND : LIGHT_FOREGROUND;
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
      const left = LED_COLUMNS + 1 - elapsed / 145;

      drawWelcomeTicker(
        context,
        metricsRef.current,
        items,
        paletteRef.current,
        foregroundRef.current,
        left,
      );

      if (!completedRef.current && left + messageWidth < -1) {
        completedRef.current = true;
        onComplete();
        return;
      }

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
  }, [items, messageWidth, onComplete]);

  return <canvas className="block size-full [image-rendering:pixelated]" ref={canvasRef} />;
}
