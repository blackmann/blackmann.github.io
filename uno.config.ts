import { presetForms } from "@julr/unocss-preset-forms";
import {
  defineConfig,
  presetIcons,
  presetWind,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
	presets: [presetWind({ dark: "media" }), presetIcons(), presetForms()],
	transformers: [transformerDirectives(), transformerVariantGroup()],
	safelist: ["i-lucide-youtube", "text-red-500"],
});
