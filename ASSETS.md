# Asset checklist

Drop files at the exact paths below. Anything missing renders as a styled
placeholder on the site that prints its own path, so nothing breaks meanwhile.

## Still needed

| Asset | Path | Shows up in |
|---|---|---|
| CV (PDF) | `public/cv/Mohamad_ElMahdi_Houmani_CV.pdf` | CV section button |
| Einstein Telescope figure *(optional)* | `public/figures/einstein-telescope/mirror_simulation.png` | compact physics card |
| Combustion figure *(optional)* | `public/figures/combustion/combustion_visualization.png` | compact physics card |

*(The two optional cards currently render without a figure, which is fine.)*

## Links to fill in (edit `src/data/`)

- **GitHub repo URLs per project** — `src/data/projects.ts`, field `github`
  (cards show `[repo link pending]` until set).
- **LinkedIn URL** — `src/data/profile.ts`, field `linkedin`
  (contact section shows a placeholder until set).

## Already in place (harvested from your project repos / papers)

| Figure | Source |
|---|---|
| `public/images/profile.jpg` | ✓ provided |
| `figures/qt-power/pc_corrected_13tev.png` | qT paper, `doc/paper/plots/pc_corrected_13tev.pdf` |
| `figures/cs-subtraction/mtt_nlo_vs_madgraph.png` | CS report figure |
| `figures/qcd/pentagons.png` | Master's thesis, Ch. 3 |
| `figures/momentum/equity_curve.png` | `Momentum_Trading/reports/figures/performance.png` |
| `figures/momentum/random_null.png` | `Momentum_Trading/reports/figures/pit_synthetic.png` |
| `figures/least-action/min_action_path.png` | `quant_cpp/figures/fig09_min_action_path.png` |
| `figures/least-action/variance_reduction.png` | `quant_cpp/figures/fig06_asian_variance_reduction.png` |
| `figures/heston/vol_surface.png` | Heston repo `reports/figures/heston_surface.png` |
| `figures/volatility/forecast_vs_realized.png` | volatility repo |
| `figures/volatility/mc_ci_convergence.png` | volatility repo |
| `figures/portfolio/risk_allocation.png` | portfolio repo `weights_risk_parity.png` |

GLAS intentionally has **no plot** — it renders as a pipeline diagram
(`src/components/GlasAlgorithm.tsx`).

## Swapping a figure

Replace the file at the same path (keep the name), or change the `figure.src`
in `src/data/projects.ts`. Captions live next to the paths in the same file.
