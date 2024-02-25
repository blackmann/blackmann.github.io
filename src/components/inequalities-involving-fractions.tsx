import { Circle, Coordinates, Mafs, Vector } from "mafs/build/index.mjs";
// import { Circle, Coordinates, Mafs, Vector } from "mafs";
import "mafs/core.css";

function Sol1NumberLine() {
	return (
		<Mafs height={200}>
			<Coordinates.Cartesian yAxis={false} />
      <Circle center={[-3, 0.5]} radius={0.25} />
      <Vector tip={[-7, 0.5]} tail={[-3.25, 0.5]} />
      <Vector tip={[4, 0.5]} tail={[-2.75, 0.5]} />
		</Mafs>
	);
}

export { Sol1NumberLine };
