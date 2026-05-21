/**
 * RSS feed — /rss.xml.
 *
 * Emits an Atom-ish RSS 2.0 feed from the blog Content Collection. Drafts
 * are filtered out. Items are sorted reverse-chronologically.
 *
 * The `_headers` Cache-Control rule already gives /rss.xml a short cache
 * window (5 min max-age, 1 hour stale-while-revalidate) so feed readers
 * see new posts within minutes of deploy.
 */
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  return rss({
    title: 'Mountain Dog Consulting',
    description:
      "Taylor Danielson's notes on assistive technology, accessibility, and the projects and tools that come out of consulting practice in British Columbia.",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/${post.data.pubDate.getFullYear()}/${post.id}/`,
      categories: post.data.tags,
    })),
    customData: '<language>en-ca</language>',
  });
}
