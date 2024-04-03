import clsx from "clsx";
import React from "react";

interface Props {
	aspectRatio: number;
	className?: string;
	id: string; // this becomes the layers file name
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
];

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

function Draw({ aspectRatio, className, id }: Props) {
	const canvas = React.useRef<HTMLCanvasElement>(null);
	const [layers, setLayers] = React.useState([]);

	const [currentStyle, setCurrentStyle] = React.useState<StyleType>("stroke");
	const [currentShape, setCurrentShape] = React.useState<ShapeType>("line");

	const [styleColors, setStyleColors] = React.useState<
		Record<StyleType, Colors>
	>({ fill: "fg", stroke: "fg" });

	function draw() {}

	function changeColor(color: Colors) {
		setStyleColors((styleColors) => ({
			...styleColors,
			[currentStyle]: color,
		}));
	}

	function startApp() {
		if (!canvas.current) {
			return;
		}
	}

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

		return () => window.removeEventListener("resize", resize);
	}, [aspectRatio]);

	React.useEffect(() => {
		return startApp();
	}, []);

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

				<div className="font-mono text-secondary text-xs">{id}</div>
			</div>
		</div>
	);
}

export { Draw };
