export interface ProjectFigure {
  /** Path under public/, e.g. "figures/least-action/min_action_path.png" */
  src: string
  caption: string
}

export interface Project {
  slug: string
  title: string
  section: 'physics' | 'quant'
  tier: 'featured' | 'compact'
  domain: string
  summary: string
  points: string[]
  /** The honest one-line takeaway — what the project actually shows. */
  conclusion: string
  stack: string[]
  figure: ProjectFigure | null
  /** TODO(user): fill in real repository URLs (see ASSETS.md). */
  github: string | null
}

export const projects: Project[] = [
  // ---------- Physics ----------
  {
    slug: 'glas',
    title: 'GLAS — General Loop Amplitude System',
    section: 'physics',
    tier: 'featured',
    domain: 'Research Software · Precision QCD',
    summary:
      'A modular framework for automated analytic tree-level and one-loop matrix-element calculations: a Python interface orchestrating QGRAF, FORM, Mathematica, and integral-reduction tools from diagram generation to finite-field reconstruction.',
    points: [
      'Automated diagram generation',
      'Dirac & colour algebra',
      'UV renormalisation',
      'Topology identification & denominator ordering',
      'IBP-reduction preparation',
      'Finite-field evaluation & functional reconstruction',
      'Massive-top QCD, massless QCD, tt̄H',
    ],
    conclusion:
      'One reproducible pipeline from process definition to evaluated amplitude — with every intermediate step inspectable.',
    stack: ['Python', 'QGRAF', 'FORM', 'Mathematica', 'FiniteFlow', 'Blade'],
    figure: null, // rendered as a paper-style algorithm block instead (GlasAlgorithm)
    github: 'https://github.com/mahdihoumanii/Heston_Stochastic_Volatility_Calibration',
  },
  {
    slug: 'qt-power',
    title: 'qT Power Corrections for Top-Quark Pair Production',
    section: 'physics',
    tier: 'featured',
    domain: 'Precision QCD · Master’s Research',
    summary:
      'Subleading small-qT expansions and power corrections for top-quark pair transverse-momentum distributions: the Low–Burnett–Kroll expansion of massive five-point amplitudes, soft–collinear matching, and real-emission contributions beyond leading power.',
    points: [
      'Low–Burnett–Kroll expansion',
      'Soft & collinear matching',
      'Massive five-point amplitudes',
      'Next-to-next-to-leading power',
      'Real-emission contributions',
      'Link to qT subtraction & resummation',
    ],
    conclusion:
      'Power corrections computed and validated region by region — the expansion is checked against the exact result, not assumed.',
    stack: ['C++', 'Mathematica', 'FORM', 'CMake'],
    figure: {
      src: 'figures/qt-power/pc_corrected_13tev.png',
      caption: 'Power-corrected qT subtraction vs. the exact NLO result at √s = 13 TeV',
    },
    github: null,
  },
  {
    slug: 'cs-subtraction',
    title: 'Catani–Seymour NLO Subtraction for pp → tt̄',
    section: 'physics',
    tier: 'compact',
    domain: 'Precision QCD',
    summary:
      'A full NLO QCD subtraction workflow for top-quark pair production: local dipoles, integrated counterterms, virtual corrections, initial-state factorisation, and phase-space integration.',
    points: [
      'Local dipole subtraction',
      'Integrated counterterms',
      'Initial-state factorisation',
      'Top++ reproduced at per-mille level',
      'Differentials consistent with MG5_aMC@NLO',
    ],
    conclusion: 'Inclusive cross sections match Top++ at per-mille accuracy; differential distributions agree with MadGraph within MC errors.',
    stack: ['C++', 'Python', 'CMake'],
    figure: {
      src: 'figures/cs-subtraction/mtt_nlo_vs_madgraph.png',
      caption: 'NLO tt̄ invariant-mass distribution vs. MadGraph5_aMC@NLO',
    },
    github: null,
  },
  {
    slug: 'five-point-amplitudes',
    title: 'Massive Five-Point Amplitudes — Master’s Thesis',
    section: 'physics',
    tier: 'compact',
    domain: 'Scattering Amplitudes',
    summary:
      'Analytic calculations of one-loop massive five-point amplitudes relevant to top-quark production in QCD, using expansion by regions and finite-field reconstruction in a FORM / Mathematica workflow.',
    points: [
      'One-loop five-point amplitudes',
      'Expansion by regions',
      'Finite-field reconstruction',
      'Numerical validation with MadGraph',
    ],
    conclusion: 'Every analytic expression cross-checked numerically before use.',
    stack: ['FORM', 'Mathematica', 'Fermat', 'Singular'],
    figure: {
      src: 'figures/qcd/pentagons.png',
      caption: 'One-loop pentagon topologies entering the five-point amplitude',
    },
    github: null,
  },
  {
    slug: 'einstein-telescope',
    title: 'Einstein Telescope Gravitational Simulation',
    section: 'physics',
    tier: 'compact',
    domain: 'Instrument Physics',
    summary:
      'Python simulations of gravitational effects on suspended mirrors for the Einstein Telescope, the proposed next-generation gravitational-wave observatory.',
    points: ['Gravitational modelling', 'Numerical simulation', 'Suspended-mirror dynamics'],
    conclusion: 'Simulation results framed within the instrument’s noise requirements.',
    stack: ['Python', 'NumPy', 'SciPy'],
    figure: null,
    github: null,
  },
  {
    slug: 'turbulent-combustion',
    title: 'Turbulent Combustion Analysis',
    section: 'physics',
    tier: 'compact',
    domain: 'Engineering Research',
    summary:
      'MATLAB routines for numerical analysis, visualisation, and experimental data processing in turbulent combustion research at RWTH Aachen.',
    points: ['Experimental data processing', 'Numerical analysis', 'Scientific visualisation'],
    conclusion: 'Hands-on experience where models meet measured data.',
    stack: ['MATLAB'],
    figure: null,
    github: null,
  },

  // ---------- Quantitative finance ----------
  {
    slug: 'momentum-backtesting',
    title: 'Point-in-Time Momentum Backtesting Engine',
    section: 'quant',
    tier: 'featured',
    domain: 'Bias-Aware Backtesting',
    summary:
      'A survivorship-aware momentum research system testing whether 12-1 monthly momentum has standalone value after transaction costs, point-in-time eligibility rules, and comparison against random portfolios.',
    points: [
      'Point-in-time universe handling',
      'Eligibility masks — delisted names stay in history',
      'Anti-look-ahead tests',
      'Transaction costs & turnover',
      'Equal-weight and random-portfolio baselines',
      'Synthetic validation',
      '68 tests',
    ],
    conclusion:
      'The system separates real signal from universe bias — and is explicit about what it does not show. No fake alpha, no overclaiming.',
    stack: ['Python', 'Pandas', 'NumPy', 'pytest'],
    figure: {
      src: 'figures/momentum/equity_curve.png',
      caption: 'Strategy vs. equal-weight baseline, net of transaction costs',
    },
    github: null,
  },
  {
    slug: 'least-action',
    title: 'Least-Action Guided Importance Sampling for Rare Path-Dependent Derivative Pricing',
    section: 'quant',
    tier: 'featured',
    domain: 'Monte Carlo · Rare Events',
    summary:
      'A research-style C++20 project formulating option pricing as a Euclidean path integral and comparing direct Monte Carlo, path-space Metropolis, exact bridge/bisection updates, drift-shift importance sampling, and a least-action guided sampler built from the constrained minimum-action path.',
    points: [
      'Path integrals & stochastic processes',
      'Rare-event derivative pricing',
      'Asian & barrier options',
      'Autocorrelation-corrected error bars',
      'Variance reduction',
      'Minimum-action path geometry',
      'C++20 · CMake · unit tests · reproducible experiments',
    ],
    conclusion:
      'Honest finding: path geometry helps for integral path constraints (up to ~40× variance reduction) but not for single-level barriers — the counterexample is reported, not hidden.',
    stack: ['C++20', 'CMake', 'Python', 'Matplotlib'],
    figure: {
      src: 'figures/least-action/min_action_path.png',
      caption: 'The curved minimum-action path pinning a rare arithmetic average',
    },
    github: null,
  },
  {
    slug: 'heston',
    title: 'Heston Stochastic Volatility: Pricing & Calibration',
    section: 'quant',
    tier: 'compact',
    domain: 'Stochastic Volatility',
    summary:
      'Heston pricing via characteristic functions, implied-volatility inversion, and nonlinear calibration to option surfaces, with no-arbitrage diagnostics and robustness checks.',
    points: [
      'Characteristic-function pricing',
      'Implied-volatility inversion',
      'Nonlinear surface calibration',
      'No-arbitrage diagnostics',
      'Robustness checks',
    ],
    conclusion: 'Calibration reported with diagnostics — including where the model fits poorly.',
    stack: ['Python', 'SciPy', 'NumPy'],
    figure: {
      src: 'figures/heston/vol_surface.png',
      caption: 'Calibrated Heston implied-volatility surface',
    },
    github: null,
  },
  {
    slug: 'volatility-option-pricing',
    title: 'Volatility Modeling & Option Pricing',
    section: 'quant',
    tier: 'compact',
    domain: 'Volatility Forecasting',
    summary:
      'End-to-end pipeline from market data to option prices: log returns, rolling and EWMA volatility, GARCH(1,1), walk-forward out-of-sample testing, then Black–Scholes and Monte Carlo pricing with 95% confidence intervals.',
    points: [
      'Rolling / EWMA / GARCH(1,1)',
      'Walk-forward out-of-sample testing',
      'Black–Scholes & Monte Carlo pricing',
      '95% confidence intervals',
      'Unit tests & mathematical report',
    ],
    conclusion: 'Forecasts evaluated strictly out-of-sample; pricing uncertainty quantified, not hidden.',
    stack: ['Python', 'arch', 'Pandas', 'pytest'],
    figure: {
      src: 'figures/volatility/forecast_vs_realized.png',
      caption: 'Walk-forward volatility forecasts vs. realised volatility',
    },
    github: 'https://github.com/mahdihoumanii/volatility_modeling_option_pricing',
  },
  {
    slug: 'portfolio-risk',
    title: 'Portfolio Management & Risk Allocation',
    section: 'quant',
    tier: 'compact',
    domain: 'Risk Allocation',
    summary:
      'Walk-forward portfolio backtesting framework implementing risk-based allocation strategies with transaction costs and performance/risk diagnostics.',
    points: ['Risk-based allocation', 'Walk-forward backtesting', 'Transaction costs', 'Drawdown & risk diagnostics'],
    conclusion: 'Allocation rules compared on risk-adjusted terms with costs included.',
    stack: ['Python', 'Pandas'],
    figure: {
      src: 'figures/portfolio/risk_allocation.png',
      caption: 'Risk-parity allocation weights through time',
    },
    github: 'https://github.com/mahdihoumanii/portfolio_management_risk_allocation',
  },
]

export const physicsFeatured = projects.filter((p) => p.section === 'physics' && p.tier === 'featured')
export const physicsCompact = projects.filter((p) => p.section === 'physics' && p.tier === 'compact')
export const quantFeatured = projects.filter((p) => p.section === 'quant' && p.tier === 'featured')
export const quantCompact = projects.filter((p) => p.section === 'quant' && p.tier === 'compact')
