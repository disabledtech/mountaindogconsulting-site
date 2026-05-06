// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import compressor from 'astro-compressor';
import remarkReadingTime from 'remark-reading-time';

// Astro 6.2+ — see PROJECT — Mountain Dog Website.md → Locked Decisions.
// Do NOT add client directives, Tailwind, scoped component <style> blocks, or raw <img> elements.

export default defineConfig({
  site: 'https://mountaindogconsulting.com',
  trailingSlash: 'always',

  // Phase 1d: inline all global CSS in <head>; HTML compression on.
  build: {
    inlineStylesheets: 'always',
  },
  compressHTML: true,

  // Astro 6 stable Fonts API — self-hosted Atkinson Hyperlegible (Latin subset),
  // Regular + Bold, font-display: swap, preload both weights.
  // Source files (TTF) are downloaded automatically by the Fonts API; no manual subset
  // is needed unless we drop the API in favour of pre-subsetted WOFF2 files in public/fonts/.
  experimental: {
    // Reserved for future use; intentionally empty so we surface any drift from stable.
  },

  // CSP is set at the edge via public/_headers (Cloudflare honours that file at deploy time).
  // We intentionally do NOT enable Astro's built-in CSP generator (security.csp) because:
  //   1. Two CSPs (header + meta) get intersected by the browser; mismatches break things.
  //   2. With inlineStylesheets:'always', the header CSP needs 'unsafe-inline' on style-src
  //      regardless of what Astro emits, so the auto-hash benefit is moot.
  // Revisit in Phase 5 if we want to tighten style-src to per-page hashes.

  markdown: {
    remarkPlugins: [remarkReadingTime],
    // remark + rehype defaults: CommonMark + GFM, footnotes, smartypants.
    smartypants: true,
    gfm: true,
    // Shiki syntax highlighting at build time, zero client JS.
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },

  integrations: [
    sitemap({
      // Apex-canonical; www → apex 301 handled at the edge via Cloudflare redirect rule.
      filter: (page) => !page.includes('/draft/'),
    }),
    // Build-time pre-compression: Brotli -11 + gzip -9.
    // Cloudflare honours pre-compressed .br and .gz files; saves ~10–15% over edge-time Brotli -5.
    compressor({
      gzip: true,
      brotli: true,
    }),
  ],

  // Astro Fonts API config — see https://docs.astro.build/en/reference/configuration-reference/#fonts
  // Self-host Atkinson Hyperlegible original (2019 release); SIL OFL.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Atkinson Hyperlegible',
      cssVariable: '--font-body',
      weights: [400, 700],
      styles: ['normal'],
      subsets: ['latin'],
      display: 'swap',
      // size-adjust applied in the global stylesheet for fallback metric matching
      fallbacks: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
    },
  ],

  vite: {
    build: {
      // Lightningcss is the Astro 6 default minifier; nothing to disable.
      cssMinify: 'lightningcss',
    },
  },
});
