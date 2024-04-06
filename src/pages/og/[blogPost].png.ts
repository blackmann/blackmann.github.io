import { Resvg } from "@resvg/resvg-js";
import type { APIRoute, GetStaticPaths } from "astro";
import satori from "satori";
import fs from "node:fs/promises";
import { getCollection } from "astro:content";
import { getOgImage } from "../../components/OgImage";

const regular = await fs.readFile("src/assets/Inter-Regular.ttf");
const bold = await fs.readFile("src/assets/Inter-Bold.ttf");
const blogOgBg = await fs.readFile("src/assets/blog-og-bg.base64.txt", "utf-8");
const logoTagImg = await fs.readFile("src/assets/logo-tag.base64.txt", "utf-8");
const arrowImg = await fs.readFile("src/assets/arrow.base64.txt", "utf-8");

export const getStaticPaths = (async () => {
	const posts = await getCollection("blog");
	return posts.map((post) => ({ params: { blogPost: post.slug } }));
}) satisfies GetStaticPaths;

const resources = {
	arrow: arrowImg,
	bg: blogOgBg,
	logo: logoTagImg,
};

export const GET = (async ({ params }) => {
	const post = (await getCollection("blog")).find(
		(post) => post.slug === params.blogPost,
	);

	const svg = await satori(getOgImage({ post, resources }), {
		width: 1280,
		height: 640,
		fonts: [
			{ name: "Inter", weight: 400, data: regular },
			{ name: "Inter", weight: 700, data: bold },
		],
	});

	const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1280 } });
	const buffer = resvg.render().asPng();

	const file = new File([buffer], `${params.blogPost}.png`);
	return new Response(file, { headers: { "Content-Type": "image/png" } });
}) satisfies APIRoute;
