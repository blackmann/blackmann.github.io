import clsx from "clsx";
import React from "react";
import rough from "roughjs";
import type { Options as RoughOptions } from "roughjs/bin/core";

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
	{ type: "arc", icon: "i-lucide-loader-circle" },
	{ type: "text", icon: "i-lucide-type" },
] as const;

const actions = [
	{ type: "undo", icon: "i-lucide-undo-2" },
	{ type: "redo", icon: "i-lucide-redo-2" },
];

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
type Colors = (typeof colors)[number];

function cs(key: string) {
	return getComputedStyle(document.documentElement).getPropertyValue(key);
}

interface Op {
	type: ShapeType;
	arguments: any;
	options: RoughOptions;
}

function Draw({ aspectRatio, className, id }: Props) {
	const canvas = React.useRef<HTMLCanvasElement>(null);
	const [layers, setLayers] = React.useState<Op[]>([]);

	const [currentStyle, setCurrentStyle] = React.useState<StyleType>("stroke");
	const [currentShape, setCurrentShape] = React.useState<ShapeType>("line");

	const [styleColors, setStyleColors] = React.useState<
		Record<StyleType, Colors>
	>({ fill: "fg", stroke: "fg" });

	const getOptions = React.useCallback(
		() => ({
			stroke: cs(`--draw-${styleColors.stroke}`),
		}),
		[styleColors],
	);

	const draw = React.useCallback(() => {
		if (!canvas.current) {
			return;
		}

		clear();

		const rc = rough.canvas(canvas.current);
		for (const op of layers) {
			switch (op.type) {
				case "line": {
					const [x1, y1, x2, y2] = op.arguments;
					rc.line(x1, y1, x2, y2, op.options);
					break;
				}

				case "ellipse": {
					const [x1, y1, x2, y2] = op.arguments;
					const w = x2 - x1;
					const h = y2 - y1;
					rc.ellipse(x1 + w / 2, y1 + h / 2, w, h, op.options);

					break;
				}

				case "rectangle": {
					const [x1, y1, x2, y2] = op.arguments;
					const w = x2 - x1;
					const h = y2 - y1;
					rc.rectangle(x1, y1, w, h, op.options);
				}
			}
		}
	}, [layers]);

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

		const rc = rough.canvas(canvas.current);

		let isDrawing = false;
		let startPoint = [0, 0];
		let endPoint = [0, 0];
		function onMouseDown(e: MouseEvent) {
			isDrawing = true;
			startPoint = [e.offsetX, e.offsetY];
		}

		function onMouseUp(e: MouseEvent) {
			endPoint = [e.offsetX, e.offsetY];

			addOp(currentShape, [...startPoint, ...endPoint]);
			draw();

			isDrawing = false;
		}

		function onMouseMove(e: MouseEvent) {
			if (!isDrawing) return;
			endPoint = [e.offsetX, e.offsetY];
			draw();

			switch (currentShape) {
				case "line": {
					rc.line(
						startPoint[0],
						startPoint[1],
						endPoint[0],
						endPoint[1],
						getOptions(),
					);

					break;
				}

				case "ellipse": {
					const w = endPoint[0] - startPoint[0];
					const h = endPoint[1] - startPoint[1];
					rc.ellipse(
						startPoint[0] + w / 2,
						startPoint[1] + h / 2,
						w,
						h,
						getOptions(),
					);

					break;
				}

				case "rectangle": {
					const w = endPoint[0] - startPoint[0];
					const h = endPoint[1] - startPoint[1];
					rc.rectangle(startPoint[0], startPoint[1], w, h, getOptions());
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
	}, [addOp, getOptions, draw, currentShape]);

	React.useEffect(() => {
		function resize() {
			if (!canvas.current) {
				return;
			}

			const parent = canvas.current.parentElement;
			if (!parent) return;
			canvas.current.width = parent?.clientWidth;
			canvas.current.height = (1 / aspectRatio) * canvas.current.width;

			draw();
		}

		window.addEventListener("resize", resize);
		resize();

		return () => window.removeEventListener("resize", resize);
	}, [aspectRatio, draw]);

	React.useEffect(() => {
		return startApp();
	}, [startApp]);

	return (
		<div>
			<header className="flex justify-between">
				<div className="flex gap-4">
					<ul className="ms-0 mb-1 flex">
						{styles.map((style) => (
							<button
								className={clsx(
									"flex flex-col gap-1 border px-2 py-1 dark:border-neutral-700 text-neutral-300 first:rounded-s-lg last:rounded-e-lg",
									{ "bg-neutral-700": style.type === currentStyle },
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

				<div>
					<ul className="ms-0 mb-1 flex">
						{actions.map((action) => (
							<button
								className={clsx(
									"flex flex-col hover:bg-neutral-800 gap-1 border px-2 py-2 dark:border-neutral-700 text-neutral-300 first:rounded-s-lg last:rounded-e-lg",
								)}
								type="button"
								key={action.type}
								onClick={() => {}}
							>
								<div className={clsx(action.icon)} />
							</button>
						))}
					</ul>
				</div>
			</header>

			<canvas
				ref={canvas}
				style={{ aspectRatio }}
				className={clsx("bg-neutral-800 w-full", className)}
			/>

			<div className="mt-1 flex justify-between">
				<ul className="ms-0 mb-1 flex">
					{shapes.map((shape) => (
						<button
							className={clsx(
								"flex flex-col gap-1 border px-2 py-1 dark:border-neutral-700 text-neutral-300 first:rounded-s-lg last:rounded-e-lg",
								{ "bg-neutral-700": shape.type === currentShape },
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

				<div className="font-mono px-1 text-secondary text-xs bg-neutral-800 rounded-md self-start">
					{id}
				</div>
			</div>
		</div>
	);
}

export { Draw };
