import { ENDPOINT } from "./fns";

async function uploadMedia(file: File): Promise<{ url: string }> {
	const formData = new FormData();
	formData.append("file", file);

	const res = await fetch(`${ENDPOINT}/media`, {
		method: "POST",
		body: formData,
	});

	return await res.json();
}

export { uploadMedia };
