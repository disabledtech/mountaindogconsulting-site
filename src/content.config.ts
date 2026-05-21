/**
 * Astro Content Collections — schema definitions (Astro 6 loader API).
 *
 * Blog posts live in `src/content/blog/` as markdown files. The `glob` loader
 * picks them up at build time; the Zod schema validates frontmatter and the
 * build fails on missing/invalid fields, which is the right pressure to keep
 * posts tidy.
 *
 * Frontmatter:
 *  - title       — string ≤80 chars, post h1 + <title> base
 *  - description — string 40–160 chars, meta description + listing excerpt
 *  - pubDate     — Date, first publish
 *  - updatedDate — Date, last meaningful edit (optional)
 *  - tags        — string[], scannable taxonomy (optional)
 *  - draft       — boolean, omit from index/sitemap/RSS when true
 *
 * Reading time comes from remark-reading-time (wired in astro.config.mjs)
 * and is surfaced at render time as `remarkPluginFrontmatter.minutesRead`.
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().max(80),
    description: z.string().min(40).max(160),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
