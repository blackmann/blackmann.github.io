import clsx from "clsx";
import React from "react";
import Cropper from "react-easy-crop";
import { useForm, type FieldValues } from "react-hook-form";
import { ENDPOINT } from "../lib/fns";
import { uploadMedia } from "../lib/upload-media";

const hostels = [
	"New Brunei",
	"Brunei Complex",
	"Baby Brunei",
	"Tek Credit",
	"Hall 7",
	"Mastercard/Impact",
	"SRC",
	"Unity Hall",
	"Republic Hall",
	"Africa Hall",
	"Independence Hall",
	"Queen Elizabeth II Hall",
	"Katanga",
];

function InstaxForm() {
	const { register, handleSubmit, setValue, watch } = useForm();
	const [image, setImage] = React.useState<any>(null);
	const [file, setFile] = React.useState<File | null>(null);
	const [crop, setCrop] = React.useState<any>({ x: 0, y: 0 });
	const [zoom, setZoom] = React.useState(1);
	const [rotation, setRotation] = React.useState(0);

	const [inProgress, setInProgress] = React.useState(false);

	function handleImageSelect(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (!file) return;

		setFile(file);
		const reader = new FileReader();
		reader.onload = () => {
			setImage(reader.result);
		};

		reader.readAsDataURL(file);
	}

	async function placeOrder(data: FieldValues) {
		if (!image || !file) return;
		setInProgress(true);

		try {
			const { url } = await uploadMedia(file, "instax");
			await fetch(`${ENDPOINT}/instax`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					quantity: data.quantity,
					mediaUrl: url,
					crop,
					rotation,
					zoom,
				}),
			});

			location.href = "/instax/success";
		} catch (err) {
			console.error(err);
			alert(
				"An error occurred while placing your order. Please try again. If this is happening again, please contact 0247812093",
			);
		} finally {
			setInProgress(false);
		}
	}

	React.useEffect(() => {
		const loader = document.querySelector("#form-loader") as HTMLElement;
		loader.style.display = "none";
	}, []);

	const $quantity = watch("quantity", 1);

	return (
		<form className="relative" onSubmit={handleSubmit(placeOrder)}>
			<div className="bg-zinc-50 rounded aspect-[2/3] p-4 shadow-lg">
				{!image && (
					<label htmlFor="image">
						<div className="bg-zinc-800 aspect-[3/4] rounded flex justify-center items-center">
							<div className="flex items-center justify-center rounded-full bg-zinc-200 dark:bg-neutral-700 w-[8rem] aspect-square text-center font-bold leading-none pulsate">
								Tap here <br />
								to select
								<br /> an image
							</div>
						</div>
					</label>
				)}

				{image && (
					<>
						<Cropper
							aspect={3 / 4}
							onCropChange={setCrop}
							image={image}
							crop={crop}
							zoom={zoom}
							onZoomChange={setZoom}
							rotation={rotation}
							objectFit="contain"
							onRotationChange={setRotation}
							classes={{
								containerClassName: "m-4 aspect-[3/4] rounded border",
							}}
						/>
					</>
				)}
			</div>

			{image && (
				<div className="flex gap-2 mt-2 text-secondary">
					<div className="i-lucide-ticket-x" />
					<div className="leading-none flex-1 text-sm">
						Not the image?{" "}
						<label htmlFor="image" className="font-medium text-blue-500">
							Click here to change image
						</label>
					</div>
				</div>
			)}

			<div className="flex gap-2 mt-2 text-secondary">
				<div className="i-lucide-scan-line" />
				<div className="leading-none flex-1 text-sm">
					After selecting an image, you will be able to resize to fit your
					preference.
				</div>
			</div>

			<div className="flex gap-2 mt-2 text-secondary">
				<div className="i-lucide-film" />
				<div className="leading-none flex-1 text-sm">Print is 54mm x 86mm</div>
			</div>

			<div className="flex gap-2 mt-4">
				<button
					type="button"
					className={clsx(
						"font-mono bg-zinc-200 dark:bg-neutral-800  rounded-lg px-1 py-1",
						{
							"!bg-green-500 text-white": $quantity === 1,
						},
					)}
					onClick={() => setValue("quantity", 1)}
				>
					1<span className="opacity-70">x</span> GHS40
				</button>

				<button
					type="button"
					className={clsx(
						"font-mono bg-zinc-200 dark:bg-neutral-800  rounded-lg px-1 py-1",
						{
							"!bg-green-500 text-white": $quantity === 2,
						},
					)}
					onClick={() => setValue("quantity", 2)}
				>
					2<span className="opacity-70">x</span> GHS70
				</button>
			</div>

			<label className="block mt-4">
				<span className="ms-1">Phone number</span>
				<input
					type="tel"
					className="block w-full rounded-lg bg-zinc-200 dark:bg-neutral-800 p-1"
					{...register("phone", { required: true })}
				/>
			</label>

			<label className="block mt-4">
				<span className="ms-1">
					Hostel
					<span className="text-secondary font-mono text-sm">(KNUST)</span>
				</span>
				<select
					className="block rounded-lg bg-zinc-200 dark:bg-neutral-800 w-full p-1"
					{...register("hostel", { required: true })}
				>
					{hostels.map((hostel) => (
						<option key={hostel} value={hostel}>
							{hostel}
						</option>
					))}
					<option value="other">Other</option>
				</select>
			</label>

			<div className="text-sm text-secondary mx-1 flex gap-2 mt-2">
				<div className="i-lucide-cable-car" />

				<div className="flex-1">
					Free delivery to the listed hostels/halls. For <i>Other</i>, delivery
					will be negotiated when confirming order.
				</div>
			</div>

			<div className="mt-2 text-secondary text-sm flex gap-2 mx-1">
				<div className="i-lucide-wallet-cards" />
				<div className="flex-1">
					Payment will be done after confirmation via phone call. You'll receive
					a call shortly after placing your order.
				</div>
			</div>

			<button
				type="submit"
				disabled={inProgress}
				className="bg-blue-500 rounded-xl p-2 w-full block mt-2 font-medium text-white disabled:opacity-60"
			>
				{inProgress ? (
					<span className="inline-flex items-center gap-2">
						<div className="i-svg-spinners-180-ring-with-bg" /> Placing order…
					</span>
				) : (
					"Place Order"
				)}
			</button>
			<input
				type="file"
				accept="image/jpg,image/jpeg,image/png"
				className="absolute top-[10rem] opacity-0 left-[1rem]"
				id="image"
				onChange={handleImageSelect}
			/>
		</form>
	);
}

export { InstaxForm };
