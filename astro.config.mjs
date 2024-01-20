import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import UnoCSS from 'unocss/astro'
import react from '@astrojs/react'
import {
  transformerNotationDiff,
  transformerNotationHighlight,
} from 'shikiji-transformers'

// https://astro.build/config
export default defineConfig({
  site: 'https://degreat.co.uk',
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
      experimentalThemes: {
        light: 'github-light',
        dark: 'vitesse-dark',
      },
      transformers: [transformerNotationDiff(), transformerNotationHighlight()],
    },
  },
  vite: {
    optimizeDeps: {
      exclude: ['@resvg/resvg-js-darwin-arm64'],
    },
  },
})
