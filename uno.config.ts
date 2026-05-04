import { presetForms } from "@julr/unocss-preset-forms";
import {
  defineConfig,
  presetIcons,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  content: {
    filesystem: ["app/**/*.{css,ts,tsx}", "app/content/**/*.{md,mdx}", "*.{ts,tsx}"],
  },
  presets: [presetWind3({ dark: "media" }), presetIcons(), presetForms()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
});
