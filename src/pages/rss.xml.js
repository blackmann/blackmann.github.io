import MarkdownIt from 'markdown-it'
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import sanitizeHTML from 'sanitize-html'

const parser = new MarkdownIt()

export async function GET(context) {
	const posts = await getCollection('blog');
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			...post.data,
			link: `/blog/${post.slug}/`,
			content: sanitizeHTML(parser.render(post.body))
		})),
	});
}
