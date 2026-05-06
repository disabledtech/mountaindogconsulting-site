# Mountain Dog Consulting site

Static marketing site for [mountaindogconsulting.com](https://mountaindogconsulting.com), built with Astro 6.2+ on Cloudflare Workers Static Assets. Accessibility-first, near-zero JavaScript, markdown blog, deploy-on-push.

All architectural decisions live in `../PROJECT — Mountain Dog Website.md`. Read that before changing anything in this directory.

## Quick start

```bash
# Use the pinned Node version
nvm use            # reads .nvmrc → 22.12.0

# Install — only run inside Cowork sandbox or CI, never on a personal machine
npm ci --ignore-scripts

# Local dev server
npm run dev        # http://localhost:4321

# Production build (output: dist/)
npm run build

# Local preview of the built site
npm run preview
```

## Audits

Every change runs through these gates in CI before deploy:

```bash
npm run audit:axe         # axe-core/cli on the dist/ directory
npm run audit:pa11y       # pa11y-ci against the built sitemap
npm run audit:lhci        # Lighthouse CI desktop (perf ≥ 98, a11y = 100)
npm run audit:lhci:mobile # Lighthouse CI mobile (perf ≥ 95, a11y = 100)
```

## Deploy

Cloudflare Workers Static Assets via Wrangler. CI deploys on green main. Local deploy from a verified clean tree:

```bash
npm run build
npm run deploy
```

Required secrets (GitHub Actions environment):

- `CLOUDFLARE_API_TOKEN` — scoped to "Workers Scripts:Edit" only
- `CLOUDFLARE_ACCOUNT_ID`

## Layout

```
site/
├── .github/workflows/deploy.yml     # CI: build → audit → deploy
├── public/
│   ├── _headers                      # Cache-control + security headers (Cloudflare honours this)
│   └── robots.txt
├── src/
│   ├── content/                      # (Phase 4) Content Collections — blog posts go here
│   ├── layouts/BaseLayout.astro      # <head> template; lang="en-CA"
│   ├── pages/                        # File-based routing — pages added in Phase 3
│   └── styles/global.css             # Single global stylesheet, palette tokens, type scale
├── astro.config.mjs                  # Astro config — see Locked Decisions in tracker
├── budgets.json                      # Lighthouse budgets (250 KB total / 0 third-party)
├── lighthouserc.json                 # LHCI desktop config
├── lighthouserc.mobile.json          # LHCI mobile config
├── tsconfig.json
└── wrangler.jsonc                    # Cloudflare Workers Static Assets config
```

## Don't type these into the codebase

From the SSG locked decisions:

- `client:load`, `client:idle`, `client:visible`, `client:media`, `client:only` — no client directives, anywhere.
- Tailwind — vanilla CSS only.
- `<style>` blocks inside components — use the global stylesheet.
- Raw `<img src="…">` — always `<Image />` or `<Picture />` so build-fail-on-missing-alt fires.

## Brand palette

| Role | Hex |
|---|---|
| Off-white (background) | `#F8F8F8` |
| Navy (primary text on light) | `#072B62` |
| Forest (secondary heading on light) | `#004225` |
| Orange (accent) | `#FCB65D` |
| Sage (decorative) | `#8FC0A9` |

Forbidden combinations: Orange on Off-white (1.65), Sage on Off-white (1.92), Navy + Forest adjacent (1.18), Orange + Sage adjacent (1.17). See `../Brand Palette and Contrast.md` for the full WCAG matrix.
