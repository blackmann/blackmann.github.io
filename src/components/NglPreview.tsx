interface Props {
	text: string;
}
function NglPreview({ text }: Props) {
	return (
		<div className="relative" id="shot">
			<div className="block w-full pt-12 p-4 bg-zinc-50 rounded-xl dark:bg-neutral-800 text-3xl text-center border-3 border-b-10 min-h-[22rem] flex-col justify-center handwriting whitespace-pre-wrap border-green-500">
				{text}
			</div>

			<div className="inline-block bg-amber-500 font-medium text-white rounded-full px-2 text-lg top-4 left-6 absolute">
				Hey Gr <span className="wave">👋🏽</span>
			</div>
		</div>
	);
}

export { NglPreview };
