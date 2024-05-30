import FileSaver from "file-saver";
import { toBlob } from "html-to-image";
import React from "react";
import { NglPreview } from "./NglPreview";

function NglDetail() {
	const [inProgress, setInProgress] = React.useState(false);
	const [text, setText] = React.useState("");

	async function saveImage() {
		const blob = await toBlob(
			document.querySelector("#shot") as HTMLDivElement,
		);
		FileSaver.saveAs(blob, "shot.png");
	}

	React.useEffect(() => {
		const url = new URL(location.href);
		const id = url.searchParams.get("id");
		const token = url.searchParams.get("token");

		fetch(`https://fns.degreat.co.uk/ngl/${id}?token=${token}`).then((res) => {
			if (res.status !== 200) {
				return
			}
			res.json().then((v) => setText(v.message));
		});
	}, []);

	if (!text) {
		return (
			<div className="flex gap-2 justify-center items-center">
				<div className="i-svg-spinners-180-ring-with-bg text-secondary" />{" "}
				Loading
			</div>
		);
	}

	return (
		<>
			<NglPreview text={text} link />

			<footer className="mt-4 text-end">
				<button
					type="button"
					onClick={saveImage}
					className="bg-pink-500 rounded-full p-2 font-medium inline-flex items-center gap-2 text-white"
				>
					{inProgress ? (
						<div className="i-svg-spinners-180-ring-with-bg" />
					) : (
						<div className="inline-block i-lucide-instagram opacity-50" />
					)}

					{inProgress ? "Downloading…" : "Download a shot"}
				</button>
			</footer>
		</>
	);
}

export { NglDetail };
