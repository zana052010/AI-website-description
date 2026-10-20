# Neural Bento

A production-ready **AI & Neural Networks Bento-Grid Showcase & Directory**. Twelve hand-curated models, bilingual RU/EN content, instant search and filtering, a detail dossier for every entry, a live capability matrix, and persistent dark/light themes — all in vanilla JavaScript.

## Stack

- **Vite 6** — dev server and production build
- **Tailwind CSS 3.4** — utility-first styling with `darkMode: 'class'`
- **PostCSS + Autoprefixer**
- **Vanilla ES modules** — no UI framework, no runtime dependencies
- **Official Lucide icons** — `lucide-static` SVGs at 1.5px stroke, bundled at build time
- **Local brand assets** — official LobeHub logos, Simple Icons GitHub mark, Unsplash preview photography
- **JSON data layer** — `src/data/ai-models.json` and `src/i18n/translations.json`

## Local development

```bash
npm install
npm run dev
```

Vite serves the app at `http://localhost:5173`.

> **Important:** do not open the root `index.html` with Live Server, `file://`, or any plain static server. Tailwind, the CSS import, and the JSON modules are compiled by Vite. Served directly, the page will appear as unstyled HTML. Use `npm run dev` for development, or build and serve `dist/` for a static preview.

## Production build

```bash
npm run build
npm run preview
```

The static site is emitted to `dist/`. `vite.config.js` uses `base: './'`, so every asset resolves correctly on GitHub Pages project subpaths.

## Asset pipeline

All visual assets are stored locally under `public/` and copied into `dist/` unchanged:

```text
public/
├── favicon.svg
└── assets/
    ├── credits.json         # Sources and licenses
    ├── icons/github.svg     # Simple Icons brand mark
    ├── logos/*.svg          # Official LobeHub AI logos
    └── previews/*.jpg       # Unsplash editorial previews
```

To refresh or verify the complete asset set:

```bash
npm run sync:assets
```

The utility at `scripts/sync-assets.mjs` downloads and validates every source, verifies SVG/document signatures, writes the credits manifest, and regenerates the favicon from the official Lucide `layout-grid` icon. Logo sources are pinned to `@lobehub/icons-static-svg@1.95.1`; photography uses fixed Unsplash photo IDs.

Every model in `ai-models.json` exposes `logoUrl`, optional `secondaryLogoUrl`, domain `faviconUrl` fallbacks, and a local `previewImage`. Logo images use an `onerror` favicon fallback and then a monogram tile, so no broken image state can occur. Preview images use a neutral skeleton shimmer and an error state when unavailable.

## Design system

- Dark: `#09090B` page, `#121215` card, `#18181C` elevated surface, `rgba(255,255,255,0.07)` hairlines, 8% top-edge inset highlight
- Light: `#F8F8F7` paper, `#FFFFFF` cards, `#F1F1EF` secondary surfaces, `rgba(0,0,0,0.08)` hairlines, layered ambient shadows
- Inter for interface and headings; JetBrains Mono for metadata, pricing, tags and benchmark metrics
- 150ms `cubic-bezier(0.16, 1, 0.3, 1)` border/background transitions, neutral pointer spotlights, 3% dot patterns, no gradient accents or neon glows

### Interface review rules applied

The visual revision follows the `better-interface`, `better-ui`, `better-typography`, `better-colors`, `better-layout`, `better-accessibility` and `better-writing` skills from [jakubkrehel/skills](https://github.com/jakubkrehel/skills) (MIT):

- **Type scale:** `3.5rem` display, `1.5rem` title, `1.25rem` featured heading, `1.125rem` heading, `0.875rem` body, `0.8125rem` captions, `0.75rem` metadata. Heading tracking is `-0.02em` / `-0.015em` / `-0.01em`; uppercase metadata is capped at `0.08em`.
- **Measure and wrapping:** body copy is capped at `60–62ch`; headings use `text-wrap: balance`; paragraphs use `text-wrap: pretty`; card descriptions keep a path to the full text through the dossier.
- **Inputs:** the search field has a visible label, example-based placeholder, 16px text on mobile and 14px from `sm` upward, plus a 3:1 boundary.
- **Accessibility:** 2px focus rings, 24px minimum link targets, a non-color check cue on the active filter, a static Live indicator, and native dialog focus restoration. Motion is reduced to an opacity/instant fallback under `prefers-reduced-motion`.
- **Interaction:** hover styles only run under `(hover: hover)`, compact controls press to `0.96` over 150ms, card entrances run only on first load, and theme changes suppress transitions before repainting.
- **Responsive:** the matrix uses a `rem`-based `auto-fit` grid and the stats tile uses a container query; layouts were verified at 1440, 1024, 768, 390, 320px and at 200% text size.
- **Color:** text pairs measure at least 5.2:1 on the dark surfaces and 4.6:1 on the light secondary surface; the input boundary is a solid 3:1 token rather than a tinted hairline.

## Deploy to GitHub Pages

1. Push the repository to GitHub with `main` as the default branch.
2. Open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main` (or run the workflow manually). `.github/workflows/deploy.yml` installs, builds, uploads, and deploys the site.

## Customization

| What | Where |
| --- | --- |
| Models, descriptions, benchmarks, logo/preview paths | `src/data/ai-models.json` |
| UI strings, filter labels, matrix copy | `src/i18n/translations.json` |
| Creator social links | `CREATOR` at the top of `src/main.js` (currently `github.com/zana052010` and `t.me/zana05001`; matching links in `index.html`) |
| Design tokens, surfaces, typography, animations | `src/style.css` |
| Brand logos, previews and licenses | `public/assets/` and `scripts/sync-assets.mjs` |
| Tailwind theme and fonts | `tailwind.config.js` |

Theme and language preferences are stored in `localStorage` under `neural-bento:theme` and `neural-bento:lang`. The initial language is detected from the browser and can be switched instantly in the dashboard tile.

## Features

- Responsive 1 / 4 / 6-column bento grid with large (2×2), medium (2×1), and compact (1×1) cards
- Official AI brand logos in consistent white product tiles, with dual marks for combined entries
- Editorial preview photography on every featured card and in each detail dossier
- Instant search across names, providers, tags, categories, descriptions, capabilities, use cases, pros, and cons — in both languages
- Relevance-ranked results, category pills with counts, animated card entry, and a reset-friendly empty state
- Accessible native `<dialog>` dossiers with Escape, backdrop-click close, focus return, and scroll lock
- Theme and language persistence with a no-flash boot script
- Capability comparison matrix (“Who leads where?”) computed from dataset benchmarks
- Keyboard shortcuts: `/` or `Ctrl/⌘ K` to search, `Enter` to open the first result, `Esc` to close/clear
- Respects `prefers-reduced-motion`; no tracking or cookies. The only routine remote request is the optional Google Fonts stylesheet; a domain favicon is requested only if a local logo fails to load.

## Credits

- AI model marks: [LobeHub Icons](https://github.com/lobehub/lobe-icons) (MIT), pinned at `1.95.1`
- GitHub mark: [Simple Icons](https://simpleicons.org/) (CC0)
- Preview photography: [Unsplash](https://unsplash.com/license), fixed photo IDs
- Interface icons: [Lucide](https://lucide.dev/license), via `lucide-static`
- Full source and license manifest: `public/assets/credits.json`
