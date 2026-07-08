# Anjana Deivasigamani — Portfolio (minimal React build)

A stripped-down React 19 + TypeScript + Vite rebuild of the portfolio, harvested
from the Manus-generated app. Keeps only the pieces worth keeping:

- **CursorMesh** — a single fixed cursor-reactive gradient-mesh canvas background
- **SpotlightZoomCard** — hover spotlight + zoom/lift card used across every section
- The rose/lavender design system (Playfair Display · DM Sans · JetBrains Mono)

Everything Manus-specific (runtime plugins, storage proxy, Express server, gsap
nav, motion dock, ~40 unused shadcn/ui components, three.js, etc.) was dropped.
Runtime dependencies are just `react`, `react-dom`, and `lucide-react`.

## Develop

```bash
cd react-portfolio
npm install
npm run dev        # http://localhost:3000
```

## Build

```bash
npm run build      # static output → dist/
npm run preview    # serve the production build locally
```

## Deploy (GitHub Pages)

`dist/` is plain static files. Because this repo is the user site
(`anjanadevan27.github.io`, served from the domain root), `vite.config.ts` keeps
`base: "/"`. To publish, build and serve `dist/` — e.g. via a GitHub Actions
Pages workflow that runs `npm ci && npm run build` and uploads `dist/`.

> Note: this does **not** auto-deploy or replace the existing static site. The
> current `index.html` / `style.css` site at the repo root is untouched.

## Customise

- **Project links** — `src/pages/Home.tsx`, the `PROJECTS` array. They currently
  all point to the GitHub profile; swap each `link` for the specific repo URL.
- **Publications** — `PUBLICATIONS` array; links are `#` placeholders (the card
  hides the "Read →" link until a real URL is set).
- **Colours** — the `P(dark)` helper at the top of `Home.tsx` and the palette
  inside `CursorMesh.tsx` / `SpotlightZoomCard.tsx`.
- **Resume / profile image** — constants at the top of `Home.tsx`.
