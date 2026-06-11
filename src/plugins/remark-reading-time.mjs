// Custom reading-time remark plugin — Astro docs pattern.
// Replaces remark-reading-time@2.1.0, which writes to file.data.readingTime,
// a location Astro never surfaces. This writes directly to
// data.astro.frontmatter.minutesRead, which the templates already read via
// remarkPluginFrontmatter.minutesRead. See Phase 5 Audit Findings §9.
import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

export function remarkReadingTime() {
  return function (tree, { data }) {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);
    // e.g. "4 min read"
    data.astro.frontmatter.minutesRead = readingTime.text;
  };
}
