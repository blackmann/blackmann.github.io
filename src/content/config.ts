import { defineCollection, z } from 'astro:content'
import { rssSchema } from '@astrojs/rss'

const blog = defineCollection({
  schema: rssSchema.extend({ tags: z.array(z.string()).optional() }),
})

const lessons = defineCollection({
  schema: rssSchema.extend({
    tags: z.array(z.string()).optional(),
    index: z.number(),
  }),
})

const courseMeta = defineCollection({
  type: 'data',
  schema: z.object({
    description: z.string(),
    meta: z.string().optional(),
    tags: z.array(z.string()),
    title: z.string(),
  }),
})

export const collections = { blog, 'course-meta': courseMeta, lessons }
