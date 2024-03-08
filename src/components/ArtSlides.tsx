import clsx from "clsx";
import React from "react";

const slides = [
	{
		url: "/02-pix-art.jpeg",
		title: "a piece of super mario! Handmade in Pixaki",
		date: "27-02",
	},
	{
		url: "/01-pix-art.jpeg",
		title: "hello world! this is pilot for ArtSlides. Pixel art made in Pixaki.",
		date: "23-02",
	},
];

function ArtSlides() {
	const [current, setCurrent] = React.useState(0);

	return (
		<div className="mx-auto w-[200px]">
			<ul>
				{slides.map((art, index) => (
					<li key={art.url} className={clsx({ hidden: current !== index })}>
						<img
							src={art.url}
							alt="art"
							width="180"
							className="image-render-pixel border-5 dark:border-neutral-700 border-zinc-300"
						/>
					</li>
				))}
			</ul>
			<div className="text-secondary mt-1 text-sm">
				<div className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 bg-zinc-200 px-2 font-medium dark:border-neutral-700 dark:bg-neutral-800">
					<div className="i-lucide-flower inline-block text-amber-500" />{" "}
					ArtSlides™
					<div className="inline-flex gap-1">
						<button
							type="button"
							className="i-lucide-triangle rotate-270 scale-90 hover:text-zinc-800 dark:hover:text-neutral-200"
							onClick={() =>
								setCurrent((current - 1 + slides.length) % slides.length)
							}
						/>
						<button
							type="button"
							className="i-lucide-triangle rotate-90 scale-90 hover:text-zinc-800 dark:hover:text-neutral-200"
							onClick={() => setCurrent((current + 1) % slides.length)}
						/>
					</div>
				</div>
				<div className="flex gap-2">
					<div className="font-mono text-xs mt-1">{slides[current].date}</div>
					<div className="flex-1 h-[4rem]">{slides[current].title}</div>
				</div>
			</div>
		</div>
	);
}

export { ArtSlides };
