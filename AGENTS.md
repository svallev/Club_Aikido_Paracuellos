# AGENTS.md

## Project status

Production-ready multi-page static site for Club de Deportivo Elemental Aikido Paracuellos. Built with Vite and deployed via GitHub Pages. Spanish-language content throughout.

## Commands

- `pnpm dev` — Vite dev server on port 5173, auto-opens browser.
- `pnpm build` — outputs to `/dist` (this is what GitHub Actions publishes).
- `pnpm lint` — ESLint (`src/**/*.js`) + Stylelint (`src/css/**/*.css`).
- `pnpm format` — Prettier (`src/**/*.{js,css,html,json}`).
- `pnpm test:a11y` — runs axe against `localhost:5173`; requires a separate `pnpm dev` process already running. No unit test suite exists.

Validate with `pnpm lint && pnpm build` after any change.

## Architecture

Vanilla Vite (no framework), plain HTML/CSS/JS ES modules. Multi-page app — each HTML file in the repo root is a separate entry (see `vite.config.js` `rollupOptions.input`). All 8 pages are inputs: `index`, `actividades`, `cursos`, `galeria`, `aviso-legal`, `privacidad`, `cookies`, `404`.

- `index.html` — home with anchored sections (Hero → Qué es el Aikido → Horarios → La Práctica → Metodología → Principios → Beneficios → CTA → Footer).
- `actividades.html`, `cursos.html` — chronological lists rendered client-side from JSON by `src/js/listpage.js`.
- `galeria.html` — grid + lightbox via `src/js/gallery.js`, populated from local `data/gallery.json` (no serverless backend).

### CSS (single entry, order matters)

Every page loads `./src/css/styles.css` (relative), which `@import`s in this exact order: `tokens → fonts → reset → layout → components → utilities`. Add rules to the matching file; do not create new top-level `@import`s.

### Data loading

JSON is fetched at runtime with **relative paths** (`data/*.json`), served from **`public/data/`** (Vite copies `public/` into `dist/`). There is **no `src/data/` directory**. Do not move these files — the runtime paths `data/actividades.json`, `data/cursos.json`, `data/gallery.json` depend on `public/`.

`gallery.js` loads directly from `data/gallery.json` and rewrites each `media_url` to a relative path (strips the leading `/`). No Instagram/Netlify function is used.

## Conventions

- **Spec-driven**: `SPEC.md` is the source of truth for design tokens, components, content, and acceptance criteria. Consult it before UI work. It is git-ignored (local only).
- **CSS variables only**: all design tokens are custom properties in `src/css/tokens.css`. No hardcoded colors, spacing, or typography in component CSS.
- **Rounded aesthetic**: tokens use `--radius-sm: 6px`, `--radius: 12px`, `--radius-full: 9999px`. Do not assume a sharp/zero-radius look.
- **Inline SVG only**: no icon libraries. Social icons are injected at runtime from `src/js/icons.js` into `[data-social]` elements; the brand mark is injected via `brandMark()` into `[data-brand]`. Keep SVG inline in `icons.js` / HTML, not as external files.
- **Self-hosted fonts**: fonts come from `@fontsource` npm packages resolved by Vite at build time (see `src/css/fonts.css`). There is no `src/fonts/` directory — do not add raw font files there. Mostly WOFF2 is produced in the build.
- **GSAP animates**: `src/js/animate.js` drives scroll/reveal animations (GSAP + ScrollTrigger). It is disabled under `prefers-reduced-motion`. Page-specific `initAnimations()` calls must be wired per page.
- **Accessibility-first**: WCAG AA contrast, `prefers-reduced-motion`, keyboard-navigable, skip-link. Target: axe 0 violations, Lighthouse ≥95.
- **Spanish content**: all user-facing text is Spanish.
- **Mobile menu**: HTML uses `.nav-toggle` + `.mobile-menu`; `main.js` (via `initChrome`) wires it. Keep these class names stable.

## GitHub Pages / deploy

- Repo: `svallev/Club_Aikido_Paracuellos` → site at `https://svallev.github.io/Club_Aikido_Paracuellos/`.
- **Relative paths everywhere**: `vite.config.js` sets `base: './'`, and all HTML/JS use relative URLs (`./`, `actividades.html`, `images/...`, `data/...`). This lets the same build work locally (`pnpm dev`), in the Pages subdirectory, and at any root. **Do not reintroduce root-absolute paths** (`/images/...`, `href="/"`, `/data/...`) — they break the subdirectory deployment. When referencing project assets in HTML/JS, use relative paths.
- `.github/workflows/deploy.yml` builds (`pnpm build`) and publishes `dist/` via `actions/deploy-pages` on push to `main` or manual dispatch. GitHub Pages source must be set to "GitHub Actions".
- `public/.nojekyll` opts the site out of Jekyll processing.
- No Netlify config/function remains (`netlify.toml` and `netlify/functions/` were removed). The gallery uses only the local `data/gallery.json` fallback.

## Gotchas

- `AGENTS.md` and `SPEC.md` are intentionally git-ignored (local-only docs). `SPEC.md` is necessary for spec-driven UI work but won't exist in a fresh clone.
- `.opencode/`, `.agents/`, `.claude/`, and `skills-lock.json` are git-ignored (local AI tooling). `pnpx skills add` can re-install skills if needed.
- A `prefers-reduced-motion` user will see static content — the `.reveal` elements start hidden via GSAP only when motion is enabled; keep content visible/semantic without JS.
- `pnpm test:a11y` will fail if the dev server isn't already running on 5173.
