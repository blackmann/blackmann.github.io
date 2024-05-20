import { ENDPOINT } from "./fns";

async function uploadMedia(
	file: File,
	group?: string,
): Promise<{ url: string }> {
	const formData = new FormData();
	formData.append("file", file);

	const res = await fetch(`${ENDPOINT}/media?group=${group}`, {
		method: "POST",
		body: formData,
	});

	return await res.json();
}

export { uploadMedia };
