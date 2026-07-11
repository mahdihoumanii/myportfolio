# mahdi-houmani-portfolio

Personal research portfolio of **Mohamad ElMahdi Houmani** — theoretical
particle physics first, expanding into quantitative finance and risk
modelling. Dark research-lab theme, physics-inspired animations, honest
project cards.

## Stack

Vite · React 19 · TypeScript (strict) · Tailwind CSS v4 · Framer Motion · KaTeX
· Fontsource (Inter + JetBrains Mono, self-hosted).

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build locally
```

## Where the content lives

All copy is data, components are presentation — edit these, not the JSX:

| File | Contents |
|---|---|
| `src/data/profile.ts` | name, subtitles, tagline, email, GitHub/LinkedIn, CV facts, languages |
| `src/data/timeline.ts` | the Beirut → Aachen → Siegen journey |
| `src/data/projects.ts` | every project card (physics + quant), figures, repo links |
| `src/data/skills.ts` | skill clusters for the constellation |
| `src/data/equations.ts` | KaTeX equations used as accents |

Missing assets → see [ASSETS.md](ASSETS.md).

## Section order

Hero (scattering event morphing into Monte Carlo paths) → Journey → Research
(Standard Model grid, top quark highlighted) → Physics projects (incl. the
GLAS pipeline diagram) → Bridge “From Particles to Portfolios” → Quant & risk
projects → Skills constellation → CV → Contact.

## Deploy

**Vercel (primary):** import the repo at vercel.com — the defaults
(`npm run build`, output `dist/`) work as-is. No config needed.

**GitHub Pages (backup):** the workflow in
`.github/workflows/deploy-pages.yml` builds with the repo name as base path
and publishes on every push to `main`. Enable *Settings → Pages → Source:
GitHub Actions* once.

## Notes

- Animations respect `prefers-reduced-motion` (static hero frame, no scroll
  effects).
- The hero canvas pauses when offscreen; no 3D libraries are used.
- Finance projects are deliberately framed as modelling research — keep it
  that way when editing copy.
