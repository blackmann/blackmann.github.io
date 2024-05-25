import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import rehypeKatext from "rehype-katex";
import remarkMath from "remark-math";
import {
	transformerNotationDiff,
	transformerNotationHighlight,
} from "shikiji-transformers";
import UnoCSS from "unocss/astro";
import { removeCodeTrail } from "./src/lib/remove-codetrail";

// https://astro.build/config
export default defineConfig({
	site: "https://degreat.co.uk",
	integrations: [
		mdx(),
		sitemap(),
		UnoCSS({
			injectReset: true,
		}),
		react(),
	],
	markdown: {
		shikiConfig: {
			themes: {
				light: "github-light",
				dark: "vitesse-dark",
			},
			transformers: [transformerNotationDiff(), transformerNotationHighlight()],
		},
		remarkPlugins: [remarkMath],
		rehypePlugins: [rehypeKatext, removeCodeTrail],
	},
	vite: {
		optimizeDeps: {
			exclude: ["@resvg/resvg-js-darwin-arm64"],
		},
	},
});
