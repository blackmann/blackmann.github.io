import transformDirectives from '@unocss/transformer-directives'
import {
  defineConfig,
  presetIcons,
  presetWind,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [presetWind({ dark: 'media' }), presetIcons()],
  transformers: [transformDirectives(), transformerVariantGroup()],
})
