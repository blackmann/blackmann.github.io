import React from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { NglPreview } from "./NglPreview";

const MAX = 200;

function NglForm() {
	const [inProgress, setInProgress] = React.useState(false);
	const [sent, setSent] = React.useState("");

	const { register, handleSubmit, watch } = useForm({
		defaultValues: { message: "" },
	});

	async function send(data: FieldValues) {
		setInProgress(true)

		await fetch("https://fns.degreat.co.uk/ngl", {
			method: "POST",
			body: JSON.stringify({ message: data.message }),
			headers: {
				"Content-Type": "application/json",
			},
		});

		setSent(data.message);
		setInProgress(false)
	}

	const length = watch("message").length;

	if (sent) {
		return (
			<div>
				<div className="text-center text-secondary mb-2">
					Your message has been sent!
				</div>

				<NglPreview text={sent} />
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit(send)}>
			<div className="relative">
				<textarea
					className="block w-full pt-12 p-4 bg-zinc-50 rounded-xl dark:bg-neutral-800 text-3xl text-center border-3 border-b-10 h-[22rem] flex-col justify-center handwriting"
					placeholder="What's been on your mind to tell/ask me?"
					maxLength={MAX}
					{...register("message", {
						required: true,
						setValueAs(value) {
							return value.trim();
						},
					})}
				/>

				<div className="inline-block bg-blue-500 text-white rounded-full px-2 text-lg top-4 left-6 absolute">
					Hey Gr <span className="wave inline-block">👋🏽</span>
				</div>
			</div>
			<div className="text-end px-3">
				<span className="text-secondary text-sm font-mono">
					{length}/{MAX}
				</span>
			</div>

			<div className="flex gap-2">
				<div className="i-lucide-receipt-text text-amber-500 mt-1" />
				<p className="text-secondary flex-1 mt-0">
					By sending, you agree that I may (or may not) share your message on
					Twitter or my Discord.
				</p>
			</div>

			<footer className="mt-4 text-end">
				<button
					type="submit"
					disabled={inProgress}
					className="bg-pink-500 rounded-full p-2 font-medium inline-flex items-center gap-2 text-white"
				>
					{inProgress ? (
						<div className="i-svg-spinners-180-ring-with-bg" />
					) : (
						<div className="inline-block i-lucide-mail opacity-50" />
					)}

					{inProgress ? "Sending…" : "Send anonymously"}
				</button>
			</footer>
		</form>
	);
}

export { NglForm };
