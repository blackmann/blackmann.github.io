import {
  defineConfig,
  presetIcons,
  presetWind,
  transformerVariantGroup,
  transformerDirectives
} from 'unocss'

export default defineConfig({
  presets: [presetWind({ dark: 'media' }), presetIcons()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
