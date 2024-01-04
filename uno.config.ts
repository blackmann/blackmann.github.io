import transformDirectives from '@unocss/transformer-directives'
import { defineConfig, presetWind } from 'unocss'

export default defineConfig({
  presets: [presetWind({ dark: 'media' })],
  transformers: [transformDirectives()],
})
