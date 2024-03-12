import clsx from "clsx";
import React from "react";

interface Props {
	courseTitle: string;
	progress: number;
	currentChapter: string;
	outline: { slug: string; data: { time: number; title: string } }[];
}

function CourseOutline({
	courseTitle,
	currentChapter,
	outline,
	progress,
}: Props) {
	const [expanded, setExpanded] = React.useState(false);

	return (
		<div className="dark:(bg-neutral-800 lg:bg-opacity-50) rounded-lg bg-zinc-50 p-2 shadow lg:shadow-none">
			<header
				className="text-secondary mx-2 mb-1 flex cursor-pointer items-center justify-between font-medium lg:pointer-events-none"
				onClick={() => setExpanded(!expanded)}
			>
				<div className="flex items-center gap-2">
					<div className="i-lucide-list-tree">menu</div> Outline
					<span className="rounded-lg bg-zinc-200 px-1 py-0.5 text-xs dark:bg-neutral-800">
						{Math.floor(progress)}%
					</span>
					{/* <span className="dark:(bg-orange-800 bg-opacity-10) ms-2 rounded-md bg-orange-200 px-1 py-0.5 text-xs text-orange-500 lg:hidden">
            {courseTitle}
          </span> */}
				</div>

				<div
					className={clsx("i-lucide-chevron-down !lg:hidden", {
						"!i-lucide-chevron-up": expanded,
					})}
				/>
			</header>

			<div className="mx-2 mb-2">
				<div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
					<div
						className="h-1.5 rounded-full bg-blue-600 dark:bg-blue-500"
						style={{ width: `${progress}%` }}

					/>
				</div>
			</div>

			<ul
				className={clsx(
					"h-0 overflow-hidden opacity-0 transition-opacity lg:h-auto lg:opacity-100",
					{
						"h-auto opacity-100": expanded,
					},
				)}
			>
				{outline.map((chapter) => (
					<li key={chapter.slug}>
						<a
							className={clsx(
								"text-secondary dark:hover:(bg-neutral-700 bg-opacity-40) flex gap-2 justify-between rounded-lg px-2 py-1 no-underline hover:bg-zinc-200 lg:dark:hover:bg-neutral-800",
								{
									"!dark:text-neutral-100 dark:(bg-neutral-700 bg-opacity-50) bg-zinc-200 font-medium !text-zinc-900":
										chapter.slug === currentChapter,
								},
							)}
							href={`/courses/${chapter.slug}`}
						>
							<span>{chapter.data.title}</span>
							{chapter.slug === currentChapter && (
								<small className="text-secondary">
									{chapter.data.time}mins
								</small>
							)}
						</a>
					</li>
				))}
			</ul>
		</div>
	);
}

export { CourseOutline };
