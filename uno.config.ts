import {
  defineConfig,
  presetIcons,
  presetWind,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
	presets: [presetWind({ dark: "media" }), presetIcons()],
	transformers: [transformerDirectives(), transformerVariantGroup()],
	safelist: ["i-lucide-youtube", "text-red-500"],
});
