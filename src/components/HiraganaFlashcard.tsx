import React from "react";
import hiragana from "../lib/hiragana.json";
import clsx from "clsx";

const chars = Object.keys(hiragana);
const pronunciations = Object.values(hiragana);

const COUNT = chars.length;

function HiraganaFlashcard() {
	const [cursor, setCursor] = React.useState(
		Math.floor(Math.random() * chars.length),
	);

	const [correct, setCorrect] = React.useState<boolean | null>(null);

	const [selected, setSelected] = React.useState(-1);

	const [char, options] = React.useMemo(() => {
		const japaneseChar = chars[cursor];
		let alt = Math.floor(Math.random() * COUNT);
		while (chars[alt] === japaneseChar) {
			alt = Math.floor(Math.random() * COUNT);
		}

		if (Math.random() < 0.51) {
			return [japaneseChar, [pronunciations[cursor], pronunciations[alt]]];
		}

		return [japaneseChar, [pronunciations[alt], pronunciations[cursor]]];
	}, [cursor, COUNT]);

	React.useEffect(() => {
		if (selected === -1) {
			return;
		}

		const timeout = setTimeout(() => {
			setCorrect(pronunciations[cursor] === options[selected]);
		}, 300);

		return () => clearTimeout(timeout);
	}, [selected, cursor, options]);

	React.useEffect(() => {
		if (correct === null) return;

		const timeout = setTimeout(() => {
			setCursor((prev) => {
				let newCursor = Math.floor(Math.random() * chars.length);
				while (newCursor === prev) {
					newCursor = Math.floor(Math.random() * chars.length);
				}

				return newCursor;
			});
		}, 1000);

		return () => clearTimeout(timeout);
	}, [correct]);

	React.useEffect(() => {
		setSelected(-1);
		setCorrect(null);
	}, [cursor]);

	return (
		<>
			<div className="flex justify-between mb-8 items-start">
				<h1 className="text-center rounded-lg px-2 capitalize font-medium text-secondary flex flex-col items-start">
					Hiragana &bull; ひらがな
					<a
						href="https://www.tofugu.com/japanese/learn-hiragana/"
						className="text-secondary flex items-center gap-2 rounded-lg bg-zinc-200 dark:bg-neutral-800 px-2 font-mono no-underline text-sm"
					>
						<div className="i-lucide-videotape inline-block" /> Check this
					</a>
				</h1>

				{/* <div className="flex items-center gap-2 rounded-2xl bg-zinc-200 dark:bg-neutral-700 p-1 font-medium pe-2">
					<div className="size-6 rounded-full bg-zinc-400 dark:bg-neutral-800" />
					yarteydegreat2
				</div> */}
			</div>

			<div className="flex flex-col items-center">
				<div
					className={clsx(
						"rounded-[2rem] border-3 dark:border-neutral-800 border-b-8 px-8 text-[16rem] font-bold transition-all",
						{
							"!border-green-700 bg-green-600 text-white": correct === true,
							"!border-red-600 bg-red-500 text-white": correct === false,
						},
					)}
				>
					{char}
				</div>

				<div className="flex gap-4 mt-2">
					{options.map((opt, index) => (
						<button
							className={clsx(
								"rounded-2xl border-3 border-b-7 dark:border-neutral-800 inline-flex justify-center w-[7rem] px-4 text-[3rem] flex items-center leading-tight transition-all font-bold",
								{
									"border-blue-600 bg-blue-500 !dark:border-blue-600 text-white":
										index === selected,
								},
							)}
							key={opt}
							disabled={selected !== -1}
							type="button"
							onClick={() => {
								if (selected === -1) {
									setSelected(index);
								}
							}}
						>
							{opt}
						</button>
					))}
				</div>
			</div>
		</>
	);
}

export { HiraganaFlashcard };
