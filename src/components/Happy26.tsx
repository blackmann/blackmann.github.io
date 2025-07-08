import clsx from "clsx";
import React from "react";

export function Happy26() {
	const [step, setStep] = React.useState(1);
  const [videoUrl, setVideoUrl] = React.useState('')

	React.useEffect(() => {
		fetch("/26.mp4")
			.then((res) => res.blob())
			.then((v) => setVideoUrl(URL.createObjectURL(v)));
	}, []);

	if (!videoUrl) {
		return (
			<div className="h-100dvh container mx-auto flex justify-center items-center">
				A moment…
			</div>
		);
	}

	if (step === 2) return <Step2 videoUrl={videoUrl} />;

	return <Step1 onProceed={() => setStep(2)} />;
}

interface StepProp {
	onProceed: VoidFunction;
}

function Step1({ onProceed }: StepProp) {
	const [clicked, setClicked] = React.useState(false);

	React.useEffect(() => {
		if (!clicked) return;
		const t = setTimeout(() => {
			onProceed();
		}, 600);

		return () => clearTimeout(t);
	}, [clicked, onProceed]);

	return (
		<div className="container mx-auto flex justify-center items-center h-100vh">
			<button
				type="button"
				className={clsx(
					"flex gap-2 items-center bg-stone-200 dark:bg-neutral-800 rounded-full px-4 py-3 animate-fade-in max-lg:hidden transition-opacity duration-600",
					{ "opacity-0": clicked },
				)}
				onClick={() => setClicked(true)}
			>
				<div className="i-solar-play-bold text-secondary" />
				Click here when you're ready
			</button>

			<div className="lg:hidden">
				Please view this on your ipad or laptop. I mean a beeeeeg screen.
			</div>
		</div>
	);
}

interface Step2Props { videoUrl: string }
function Step2({ videoUrl }: Step2Props) {
	return (
		<div style={{ fontFamily: "Nunito", fontSize: 16 }}>
			<div className="container mx-auto flex flex-col justify-center items-center min-h-100dvh py-8rem">
				<div className="aspect-[4/5] bg-stone-200 dark:bg-neutral-800 rounded-2xl w-30rem shadow-lg overflow-hidden animate-fade-in animate-duration-3000">
					<video
						src={videoUrl}
						className="w-full"
						playsInline
						controls
						autoPlay
					/>
				</div>

				<div className="w-30rem mt-4">
					<h1 className="font-black text-2xl opacity-40">26</h1>
					<p>
						For so many years, I lived with just myself knowing there’s no one
						who will care and be there for me since my mom. But I’ve come to
						easily to depend and you; and over and over again, you’ve shown to
						be dependable. Thank you.
					</p>

					<p className="mt-4">
						I’ve also watched you grow more beautifully and become a great
						leader. It’s really inspiring!
					</p>

					<p className="mt-4">
						You’re an amazing woman and I’m blessed to have you at 26.
					</p>

					<div>Happy birthday 🎈</div>
					<div id="signature"></div>
					<div>I love you</div>
				</div>
			</div>

			<div className="aspect-square w-25rem absolute -left-65 top-10 bg-stone-200 dark:bg-neutral-800 -rotate-60 rounded-2xl shadow-lg" />
			<div className="aspect-square w-25rem absolute -right-65 top-5 bg-stone-200 dark:bg-neutral-800 rotate-10 rounded-2xl shadow-lg" />
			<div className="aspect-square w-25rem absolute -left-85 top-100 bg-stone-200 dark:bg-neutral-800 -rotate-30 rounded-2xl shadow-lg" />
			<div className="aspect-square w-25rem absolute -left-65 top-200 bg-stone-200 dark:bg-neutral-800 -rotate-70 rounded-2xl shadow-lg" />
			<div className="aspect-square w-25rem absolute -right-65 top-180 bg-stone-200 dark:bg-neutral-800 rotate-60 rounded-2xl shadow-lg" />
		</div>
	);
}
