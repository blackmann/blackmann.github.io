import clsx from "clsx";
import React from "react";
import rough from "roughjs";
import type { Options as RoughOptions } from "roughjs/bin/core";
import { useColorScheme } from "../lib/use-color-scheme";
import { getStrokePoints } from "perfect-freehand";

interface Props {
	aspectRatio: number;
	className?: string;
	id: string; // this becomes the layers' file name
}

const styles = [
	{ type: "stroke", icon: "i-lucide-minus" },
	{ type: "fill", icon: "i-lucide-paint-bucket" },
] as const;

const shapes = [
	{ type: "line", icon: "i-lucide-slash" },
	{ type: "rectangle", icon: "i-lucide-square" },
	{ type: "ellipse", icon: "i-lucide-circle" },
	{ type: "freehand", icon: "i-lucide-pen-line" },
	{ type: "text", icon: "i-lucide-type" },
] as const;

const actions = [
	{ type: "outline", icon: "i-lucide-square-menu" },
	// { type: "undo", icon: "i-lucide-undo-2" },
	// { type: "redo", icon: "i-lucide-redo-2" },
] as const;

const colors = [
	"fg",
	"red",
	"orange",
	"yellow",
	"green",
	"blue",
	"indigo",
	"violet",
	"pink",
] as const;

type StyleType = (typeof styles)[number]["type"];
type ShapeType = (typeof shapes)[number]["type"];
type ActionType = (typeof actions)[number]["type"];
type Colors = (typeof colors)[number];

function cs(key: string) {
	return getComputedStyle(document.documentElement).getPropertyValue(key);
}

function renderPath(path: [number, number][]) {
	const dpi = window.devicePixelRatio;
	const points = getStrokePoints(path, { size: dpi });
	let render = "";

	for (const {
		point: [x, y],
	} of points) {
		if (!render) {
			render += `M ${x * dpi} ${y * dpi}`;
			continue;
		}

		render += `L  ${x * dpi} ${y * dpi}`;
	}

	return render;
}

function xDown(
	canvasWidth: number,
	[x, y]: [number, number],
): [number, number] {
	return [x / canvasWidth, y / canvasWidth];
}

function xUp(canvasWidth: number, [x, y]: [number, number]): [number, number] {
	return [x * canvasWidth, y * canvasWidth];
}

interface Op {
	type: ShapeType;
	arguments: [
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		text: string,
		path: [number, number][],
	];
	options: RoughOptions;
}

function Draw({ aspectRatio, className, id }: Props) {
	const theme = useColorScheme();
	const readOnly = process.env.NODE_ENV === "production";

	const [ready, setReady] = React.useState(false);

	const canvas = React.useRef<HTMLCanvasElement>(null);
	const [layers, setLayers] = React.useState<Op[]>([]);

	const [currentStyle, setCurrentStyle] = React.useState<StyleType>("stroke");
	const [currentShape, setCurrentShape] = React.useState<ShapeType>("line");

	const [hovered, setHovered] = React.useState(-1);
	const [showOutline, setShowOutline] = React.useState(false);

	const [text, setText] = React.useState("");

	const [styleColors, setStyleColors] = React.useState<
		Record<StyleType, Colors>
	>({ fill: "fg", stroke: "fg" });

	const getOptions = React.useCallback(
		(now = false) =>
			({
				stroke: now ? cs(`--draw-${styleColors.stroke}`) : styleColors.stroke,
				seed: Math.random() * 100,
				strokeWidth: now ? window.devicePixelRatio : undefined,
			}) satisfies RoughOptions,
		[styleColors],
	);

	function performAction(action: ActionType) {
		switch (action) {
			case "outline": {
				setShowOutline((v) => !v);
			}
		}
	}

	const draw = React.useCallback(() => {
		if (!canvas.current) {
			return;
		}

		const ctx = canvas.current.getContext("2d") as CanvasRenderingContext2D;
		const cw = Number(canvas.current.style.width.replace("px", ""));

		clear();

		const rc = rough.canvas(canvas.current);
		for (const [c, op] of layers.entries()) {
			const i = layers.length - c - 1;
			const dpi = window.devicePixelRatio;

			const options = { ...op.options, strokeWidth: dpi };
			options.stroke = cs(`--draw-${options.stroke}`);

			if (hovered === i) {
				options.stroke = "#454459";
			}

			const [xs1, ys1, xs2, ys2, text] = op.arguments;
			const [x1, y1] = xUp(cw, [xs1, ys1]);
			const [x2, y2] = xUp(cw, [xs2, ys2]);

			const w = x2 - x1;
			const h = y2 - y1;

			switch (op.type) {
				case "line": {
					rc.line(x1 * dpi, y1 * dpi, x2 * dpi, y2 * dpi, options);
					break;
				}

				case "ellipse": {
					rc.ellipse(
						(x1 + w / 2) * dpi,
						(y1 + h / 2) * dpi,
						w * dpi,
						h * dpi,
						options,
					);

					break;
				}

				case "rectangle": {
					rc.rectangle(x1 * dpi, y1 * dpi, w * dpi, h * dpi, options);

					break;
				}

				// [ ] Improve: wrap text
				case "text": {
					ctx.save();
					ctx.font = getFont();
					ctx.textBaseline = "top";
					ctx.fillStyle = options.stroke;
					const w = ctx.measureText(text).width;
					ctx.fillText(text, x1 * dpi - w / 2, y1 * dpi, w);
					ctx.restore();

					break;
				}

				case "freehand": {
					const [, , , , , path] = op.arguments;
					rc.path(renderPath(path.map((p) => xUp(cw, p))), options);
				}
			}
		}
	}, [layers, hovered]);

	function clear() {
		const cv = canvas.current;
		if (!cv) return;

		cv.getContext("2d")?.clearRect(0, 0, cv.width, cv.height);
	}

	function changeColor(color: Colors) {
		setStyleColors((styleColors) => ({
			...styleColors,
			[currentStyle]: color,
		}));
	}

	function getFont() {
		const dpi = window.devicePixelRatio;
		const fs = Number(cs("--draw-fs"));

		return `${fs * dpi}px 'Indie Flower'`;
	}

	const addOp = React.useCallback(
		(type: Op["type"], args: Op["arguments"]) => {
			setLayers((layers) => [
				...layers,
				{ type, arguments: args, options: getOptions() },
			]);
		},
		[getOptions],
	);

	const startApp = React.useCallback(() => {
		if (!canvas.current || readOnly) {
			return;
		}

		const ctx = canvas.current.getContext("2d") as CanvasRenderingContext2D;
		const rc = rough.canvas(canvas.current);
		const dpi = window.devicePixelRatio;
		const cw = Number(canvas.current.style.width.replace("px", ""));

		let isDrawing = false;
		let startPoint: [number, number] = [0, 0];
		let endPoint: [number, number] = [0, 0];
		let path: [number, number][] = [];

		function onMouseDown(e: MouseEvent) {
			isDrawing = true;
			setHovered(-1);
			const [x, y] = [e.offsetX, e.offsetY];
			startPoint = [x, y];

			if (currentShape === "freehand") {
				path = [[x, y]];
			}
		}

		function onMouseUp(e: MouseEvent) {
			isDrawing = false;
			endPoint = [e.offsetX, e.offsetY];

			if (
				currentShape !== "text" &&
				endPoint[0] - startPoint[0] < 2 &&
				endPoint[1] - startPoint[1] < 2
			) {
				return;
			}

			if (currentShape === "text" && !text) {
				return;
			}

			addOp(currentShape, [
				...xDown(cw, startPoint),
				...xDown(cw, endPoint),
				text,
				path.map((p) => xDown(cw, p)),
			]);

			draw();
		}

		function onMouseMove(e: MouseEvent) {
			if (!isDrawing) return;

			if (currentShape === "text") {
				startPoint = [e.offsetX, e.offsetY];
			}

			endPoint = [e.offsetX, e.offsetY];

			draw();

			const [x1, y1, x2, y2] = [
				startPoint[0],
				startPoint[1],
				endPoint[0],
				endPoint[1],
			];

			const w = x2 - x1;
			const h = y2 - y1;

			switch (currentShape) {
				case "line": {
					rc.line(x1 * dpi, y1 * dpi, x2 * dpi, y2 * dpi, getOptions(true));

					break;
				}

				case "ellipse": {
					rc.ellipse(
						(x1 + w / 2) * dpi,
						(y1 + h / 2) * dpi,
						w * dpi,
						h * dpi,
						getOptions(true),
					);

					break;
				}

				case "rectangle": {
					rc.rectangle(x1 * dpi, y1 * dpi, w * dpi, h * dpi, getOptions(true));

					break;
				}

				case "text": {
					if (!text) {
						return;
					}

					ctx.save();
					ctx.font = getFont();
					ctx.textBaseline = "top";
					ctx.fillStyle = cs(`--draw-${getOptions().stroke}`);
					const w = ctx.measureText(text).width;
					ctx.fillText(text, x1 * dpi - w / 2, y1 * dpi, w);
					ctx.restore();

					break;
				}

				case "freehand": {
					path.push([x2, y2]);

					rc.path(renderPath(path), getOptions(true));
				}
			}
		}

		canvas.current.addEventListener("mousedown", onMouseDown);
		canvas.current.addEventListener("mouseup", onMouseUp);
		canvas.current.addEventListener("mousemove", onMouseMove);

		return () => {
			canvas.current?.removeEventListener("mousedown", onMouseDown);
			canvas.current?.removeEventListener("mouseup", onMouseUp);
			canvas.current?.removeEventListener("mousemove", onMouseMove);
		};
	}, [addOp, getOptions, draw, currentShape, text, readOnly]);

	React.useEffect(() => {
		function resize() {
			if (!canvas.current) {
				return;
			}

			const dpi = window.devicePixelRatio;

			const cv = canvas.current;

			const parent = cv.parentElement;
			if (!parent) return;

			const w = parent.clientWidth;
			const h = (1 / aspectRatio) * w;
			cv.width = w * dpi;
			cv.height = h * dpi;
			cv.style.width = `${w}px`;
			cv.style.height = `${h}px`;

			draw();
		}

		window.addEventListener("resize", resize);
		resize();

		return () => window.removeEventListener("resize", resize);
	}, [aspectRatio, draw]);

	React.useEffect(() => {
		return startApp();
	}, [startApp]);

	React.useEffect(() => {
		if (layers.length === 0) {
			setShowOutline(false);
		}
	}, [layers.length]);

	React.useEffect(() => {
		draw();
		document.fonts.ready.then(() => draw());
	}, [theme, draw]);

	React.useEffect(() => {
		fetch(`/drawings/${id}.json`)
			.then((res) => {
				res.json().then((layers) => {
					setLayers(layers);
				});
			})
			.finally(() => {
				setReady(true);
			});
	}, [id]);

	React.useEffect(() => {
		if (!ready) return;

		fetch(`http://localhost:4444/draw/${id}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(layers),
		});
	}, [layers, id, ready]);

	return (
		<div>
			<header className={clsx("flex justify-between", { "!hidden": readOnly })}>
				<div className="flex gap-4">
					<ul className="ms-0 mb-1 flex">
						{styles.map((style) => (
							<button
								className={clsx(
									"flex flex-col gap-1 border border-zinc-300 px-2 py-1 dark:border-neutral-700 text-zinc-700 dark:text-neutral-300 first:rounded-s-lg last:rounded-e-lg",
									{
										"bg-zinc-300 dark:bg-neutral-700":
											style.type === currentStyle,
									},
								)}
								disabled={style.type === "fill"}
								type="button"
								key={style.type}
								onClick={() => setCurrentStyle(style.type)}
							>
								<div
									className={clsx(style.icon, {
										"text-secondary": style.type !== currentStyle,
									})}
								/>
								<div
									style={{
										backgroundColor: `var(--draw-${styleColors[style.type]})`,
									}}
									className="h-1 rounded-sm w-full"
								/>
							</button>
						))}
					</ul>

					<ul className="ms-0 list-none flex items-center gap-2">
						{colors.map((color) => (
							<li key={color} className="mt-0">
								<button
									type="button"
									style={{ backgroundColor: `var(--draw-${color})` }}
									className=" size-4 rounded-md"
									onClick={() => changeColor(color)}
								/>
							</li>
						))}
					</ul>
				</div>

				<div className="flex flex-col">
					<ul className="ms-0 mb-1 flex">
						{actions.map((action) => (
							<button
								className={clsx(
									"flex flex-col hover:bg-zinc-200 dark:hover:bg-neutral-800 gap-1 border px-2 py-2 dark:border-neutral-700 first:rounded-s-lg last:rounded-e-lg",
								)}
								type="button"
								key={action.type}
								onClick={() => performAction(action.type)}
							>
								<div className={clsx(action.icon)} />
							</button>
						))}
					</ul>

					<div className="relative">
						<ul
							className={clsx(
								"w-[10rem] max-h-[20rem] border dark:border-neutral-700 rounded-lg overflow-y-auto absolute list-none ms-0 right-1 top-1 bg-zinc-100 dark:bg-neutral-900 transition-all",
								{ "h-0 opacity-0": !showOutline },
							)}
							onMouseLeave={() => setHovered(-1)}
						>
							{[...layers].reverse().map((it, index) => (
								<li
									key={`${it.type}-${index}`}
									className="px-2 py-0.5 mt-0 hover:bg-zinc-200 dark:hover:bg-neutral-800 font-mono text-sm flex justify-between border-b last:border-b-0 dark:border-neutral-800"
									onMouseEnter={() => setHovered(index)}
								>
									<span>{it.type}</span>
									<button
										type="button"
										className="i-lucide-minus text-secondary"
										onClick={() =>
											setLayers((layers) => layers.filter((i) => i !== it))
										}
									/>
								</li>
							))}
						</ul>
					</div>
				</div>
			</header>

			<canvas
				ref={canvas}
				style={{ aspectRatio }}
				aria-label={id}
				className={clsx(
					"bg-zinc-200 bg-opacity-30 dark:bg-neutral-800 dark:bg-opacity-100 w-full",
					className,
				)}
			/>

			<div
				className={clsx("mt-1 flex justify-between", { "!hidden": readOnly })}
			>
				<ul className="ms-0 mb-1 flex">
					{shapes.map((shape) => (
						<button
							title={shape.type}
							className={clsx(
								"flex flex-col gap-1 border border-zinc-300 px-2 py-1 dark:border-neutral-700 text-zinc-800 dark:text-neutral-300 first:rounded-s-lg last:rounded-e-lg",
								{
									"bg-zinc-300 dark:bg-neutral-700":
										shape.type === currentShape,
								},
							)}
							type="button"
							key={shape.type}
							onClick={() => setCurrentShape(shape.type)}
						>
							<div
								className={clsx(shape.icon, {
									"text-secondary": shape.type !== currentShape,
								})}
							/>
						</button>
					))}
				</ul>

				<div className="font-mono px-1 text-secondary text-xs bg-zinc-200 dark:bg-neutral-800 rounded-md self-start">
					{id}
				</div>
			</div>

			<div className="relative">
				<textarea
					className={clsx(
						"rounded-lg border py-0.5 p-1 dark:border-neutral-700 absolute top-1 left-0 text-sm font-mono h-[6rem] transition-all",
						{ "h-0 opacity-0": currentShape !== "text" },
					)}
					value={text}
					disabled={currentShape !== "text"}
					placeholder="text here then drag to draw"
					onChange={(e) => setText(e.target.value)}
				/>
			</div>
		</div>
	);
}

export { Draw };
