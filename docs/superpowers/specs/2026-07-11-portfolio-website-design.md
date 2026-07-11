# Portfolio Website — Design Spec

**Date:** 2026-07-11
**Owner:** Mohamad ElMahdi Houmani
**Status:** Approved (user confirmed in session)

## Purpose

A personal portfolio website that tells a coherent scientific and technical
journey — theoretical physics, quantitative modelling, scientific computing,
data science — and showcases eight projects. Target audiences: academic,
research, quantitative finance, data science, AI implementation, and
scientific computing opportunities.

**Central narrative:** Beirut → Aachen → Siegen / Cluster of Excellence
"Color Meets Flavour" → CERN/LHC phenomenology.

## Non-goals / guardrails

- Not a generic developer portfolio; not a crypto/trading hype page.
- No exaggerated finance claims — finance projects are presented as rigorous
  modelling/research (bias control, point-in-time testing, reproducibility,
  uncertainty), never as "strategies that make money".
- Visually impressive but academically credible. No green/red PnL colours.

## Stack

- **Vite + React 19 + TypeScript (strict)** — static single-page site.
- **Tailwind CSS v4** (via `@tailwindcss/vite`, CSS-first config).
- **Framer Motion** for scroll-driven and entrance animations.
- **KaTeX** for TeX equations (accents, not decoration walls).
- **Fonts:** Inter (text) + JetBrains Mono (code/numeric accents),
  self-hosted via Fontsource.
- **Theme:** dark research-lab — near-black `#0a0e14` base, desaturated cyan
  accent, faint grid/particle textures.
- **Deployment:** Vercel-first (zero config, base `/`). GitHub Pages workflow
  as backup (`vite build --base=/<repo>/` in CI).

## Architecture

Single scrolling page. All content lives in typed data files; components are
pure presentation.

```
src/
  data/        profile.ts, timeline.ts, projects.ts, skills.ts, equations.ts
  components/  Nav, Hero, HeroCanvas, Journey, FeaturedProjects, MoreWork,
               Research, QuantFinance, Skills, CVSection, Contact, Footer
  components/shared/  Section, FigurePlaceholder, Tag, Equation
public/
  cv/          Houmani_CV.pdf            (user drops in)
  figures/     <project-slug>/*.png      (user drops in)
```

Missing assets render as styled placeholder blocks printing their exact
target path; `ASSETS.md` at the repo root is the drop-in checklist.

## Sections (in order)

1. **Hero** — name, subtitle line
   (Theoretical Physics | Quantitative Modelling | Scientific Computing | Data Science),
   tagline "I build mathematical and computational models for physics,
   finance, and risk." Buttons: View Projects, View CV, GitHub, Contact.
   Visual: full-bleed canvas of Monte Carlo paths diffusing from a point with
   a highlighted curved minimum-action path and faint grid. Respects
   `prefers-reduced-motion`.
2. **Journey** — scroll-driven timeline: Beirut (BSc General Physics,
   Lebanese University 2018–2021) → Aachen (MSc Physics, RWTH 2022–2024, QFT
   & gauge theories) → RWTH research (Prof. Michal Czakon: QCD, top-quark,
   finite-field methods, small-qT expansions, MadGraph comparisons) → Siegen
   (PhD, Prof. Wolfgang Kilian, Cluster of Excellence "Color Meets Flavour")
   → direction: precision physics, CERN/LHC phenomenology, quantitative
   modelling.
3. **Featured Projects** — four large cards in priority order:
   1. Point-in-Time Momentum Backtesting Engine (bias control, 68 tests,
      honest no-overclaim conclusion — leads because it shows research maturity)
   2. Least-Action Guided Importance Sampling (C++20 path-integral pricing,
      figure slots for min-action path / variance reduction)
   3. Heston Stochastic Volatility: Pricing & Calibration
   4. Volatility Modeling & Option Pricing (GARCH/EWMA, walk-forward, BS + MC)
4. **More Work** — compact cards: Portfolio Management & Risk Allocation;
   QCD / Massive Five-Point Amplitudes; Einstein Telescope simulation;
   Turbulent Combustion research.
5. **Research / Physics** — scientific identity: QFT, gauge theories, QCD,
   top-quark physics, precision calculations, finite-field methods, MadGraph,
   small-qT expansions; supervisors and Cluster of Excellence; a few KaTeX
   equations as accents.
6. **Quantitative Finance / Risk** — groups the finance work under robust
   testing / reproducibility / bias control / uncertainty framing.
7. **Skills** — interactive constellation of seven clusters (Mathematical
   Modelling, Programming, Python/Data, Physics Tools, Quant/Finance,
   Data Engineering, Soft Skills); degrades to a clean grid on mobile and
   under reduced motion.
8. **CV** — download/view card (`public/cv/Houmani_CV.pdf`) + condensed facts
   incl. languages (Arabic native, English fluent, French fluent, German B2).
9. **Contact** — email `elmahdi.houmani@rwth-aachen.de`, GitHub, LinkedIn
   placeholder, Location: Germany.

## Quality bar

- TypeScript strict; production build passes clean.
- Responsive: verified at 375 px and desktop.
- `prefers-reduced-motion` disables canvas animation and heavy transitions.
- Performance: no heavy 3D libs; canvas hero is rAF-based and paused when
  offscreen.

## Decisions log

- Theme: dark research-lab (user choice).
- Deploy: Vercel first, GH Pages backup (user choice).
- Public email: `elmahdi.houmani@rwth-aachen.de` (user provided).
- First version ships with placeholders for figures/photos/CV (user approved).
