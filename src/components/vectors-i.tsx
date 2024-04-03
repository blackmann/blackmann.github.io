import {
	Mafs,
	Coordinates,
	Text,
	Vector,
	useMovablePoint,
	vec,
} from "mafs/build/index.mjs";
// import { Mafs, Coordinates, Circle, Vector, useMovablePoint, vec } from "mafs";
import React from "react";
import rough from "roughjs";
import { useColorScheme } from "../lib/use-color-scheme";

function PolarCoordinate() {
	const [r, t] = [3, Math.PI / 5];
	return (
		<Mafs height={300}>
			<Coordinates.Polar subdivisions={5} lines={3} />
			<Vector tip={[Math.cos(t) * r, Math.sin(t) * r]} />
		</Mafs>
	);
}

function UnitVectorDemo() {
	const im = useMovablePoint([5, 0], {
		constrain: "horizontal",
		color: "red",
	});
	const jm = useMovablePoint([0, 2], { constrain: "vertical", color: "green" });

	const i = [1, 0] as const;
	const j = [0, 1] as const;

	const scaledI = vec.scale(i, im.x);
	const scaledJ = vec.scale(j, jm.y);
	const resultant = vec.add(scaledI, scaledJ);

	React.useEffect(() => {
		const timeout = setTimeout(() => {
			im.setPoint([Math.round(im.x), im.y]);
			jm.setPoint([jm.x, Math.round(jm.y)]);
		}, 100);

		return () => clearTimeout(timeout);
	}, [im, jm]);

	return (
		<Mafs height={300}>
			<Coordinates.Cartesian />

			<Vector color="orange" tip={scaledI} />
			<Vector color="blue" tip={scaledJ} />

			<Vector color="red" opacity={0.5} tip={i} />
			<Vector color="green" opacity={0.5} tip={j} />

			<Vector style="dashed" tip={resultant} />

			{im.element}
			{jm.element}

			<Text x={1} y={-0.5} size={14}>
				i(1,0)
			</Text>
			<Text x={-0.5} y={1} size={14}>
				j(0,1)
			</Text>

			<Text x={scaledI[0]} y={-0.5} size={14}>
				p={Math.round(im.x)}
			</Text>
			<Text x={-0.5} y={scaledJ[1]} size={14}>
				q={Math.round(jm.y)}
			</Text>

			<Text x={resultant[0]} y={[resultant[1] + 0.25]} size={14}>
				{Math.round(im.x)}i + {Math.round(jm.y)}j
			</Text>
		</Mafs>
	);
}

function cs(key: string) {
	return getComputedStyle(document.documentElement).getPropertyValue(key);
}

function VectorAddPolarExample() {
	const canvas = React.useRef<HTMLCanvasElement>(null);
	const theme = useColorScheme();

	function draw() {
		if (!canvas.current) {
			return;
		}

		const fg = canvas.current
			.getContext("2d")
			?.clearRect(0, 0, canvas.current.width, canvas.current.height);

		const rc = rough.canvas(canvas.current);

		const strokeColor = cs("--draw-fg");

		rc.line(50, 50, 50, 250, { stroke: strokeColor });
		rc.line(50, 250, 180, 250, { stroke: strokeColor });
		rc.line(50, 250, 180, 50, { stroke: strokeColor });
	}

	React.useEffect(() => {
		draw();
	}, [theme]);

	return <canvas width={600} height={400} ref={canvas} />;
}

export { PolarCoordinate, UnitVectorDemo, VectorAddPolarExample };
