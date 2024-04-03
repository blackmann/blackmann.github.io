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

interface Op {
	type: ShapeType;
	arguments: any;
	options: RoughOptions;
}

function Draw({ aspectRatio, className, id }: Props) {
	const theme = useColorScheme();

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

			switch (op.type) {
				case "line": {
					const [x1, y1, x2, y2] = op.arguments;
					rc.line(x1 * dpi, y1 * dpi, x2 * dpi, y2 * dpi, options);
					break;
				}

				case "ellipse": {
					const [x1, y1, x2, y2] = op.arguments;
					const w = x2 - x1;
					const h = y2 - y1;
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
					const [x1, y1, x2, y2] = op.arguments;
					const w = x2 - x1;
					const h = y2 - y1;
					rc.rectangle(x1 * dpi, y1 * dpi, w * dpi, h * dpi, options);

					break;
				}

				// [ ] Improve: wrap text
				case "text": {
					const [x1, y1, x2, y2, text] = op.arguments;
					ctx.save();
					ctx.font = getFont();
					ctx.textBaseline = "top";
					ctx.fillStyle = options.stroke;
					ctx.fillText(text, x1 * dpi, y1 * dpi, (x2 - x1) * dpi);
					ctx.restore();

					break;
				}

				case "freehand": {
					const [, , , , , path] = op.arguments;
					rc.path(renderPath(path), options);
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
		return `${18 * dpi}px 'Indie Flower'`;
	}

	const addOp = React.useCallback(
		(type: Op["type"], args: any) => {
			setLayers((layers) => [
				...layers,
				{ type, arguments: args, options: getOptions() },
			]);
		},
		[getOptions],
	);

	const startApp = React.useCallback(() => {
		if (!canvas.current) {
			return;
		}

		const ctx = canvas.current.getContext("2d") as CanvasRenderingContext2D;
		const rc = rough.canvas(canvas.current);
		const dpi = window.devicePixelRatio;

		let isDrawing = false;
		let startPoint = [0, 0];
		let endPoint = [0, 0];
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

			if (endPoint[0] - startPoint[0] < 2 && endPoint[1] - startPoint[1] < 2) {
				return;
			}

			if (currentShape === "text" && !text) {
				return;
			}

			addOp(currentShape, [...startPoint, ...endPoint, text, path]);
			draw();
		}

		function onMouseMove(e: MouseEvent) {
			if (!isDrawing) return;
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
					ctx.fillStyle = getOptions().stroke;
					ctx.fillText(text, x1 * dpi, y1 * dpi, (x2 - x1) * dpi);
					ctx.restore();

					rc.rectangle(x1 * dpi, y1 * dpi, w * dpi, h * dpi, {
						stroke: cs("--draw-fg"),
					});

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
	}, [addOp, getOptions, draw, currentShape, text]);

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
	}, [theme]);

	return (
		<div>
			<header className="flex justify-between">
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
									key={index}
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
				className={clsx(
					"bg-zinc-200 bg-opacity-30 dark:bg-neutral-800 dark:bg-opacity-100 w-full",
					className,
				)}
			/>

			<div className="mt-1 flex justify-between">
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
