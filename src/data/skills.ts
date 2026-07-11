export interface SkillCluster {
  id: string
  name: string
  items: string[]
}

export const skillClusters: SkillCluster[] = [
  {
    id: 'theory',
    name: 'Theoretical Physics',
    items: [
      'Perturbative QCD',
      'Scattering amplitudes',
      'Higher-order corrections',
      'Infrared factorization',
      'Subtraction methods',
      'Power corrections',
      'Loop integrals',
      'Differential equations',
      'Collider phenomenology',
    ],
  },
  {
    id: 'symbolic',
    name: 'Symbolic & Computational Methods',
    items: [
      'Finite-field evaluation',
      'Functional reconstruction',
      'IBP reduction',
      'Analytic asymptotic expansions',
      'Symbolic–numerical cross-checks',
    ],
  },
  {
    id: 'physics-software',
    name: 'Specialised Physics Software',
    items: [
      'FORM',
      'QGRAF',
      'FeynCalc',
      'Kira',
      'FiniteFlow',
      'Fermat',
      'Singular',
      'MadGraph5_aMC@NLO',
      'Mathematica',
    ],
  },
  {
    id: 'programming',
    name: 'Programming',
    items: ['Python', 'C++', 'MATLAB', 'Mathematica', 'Shell scripting', 'SQL'],
  },
  {
    id: 'scientific-computing',
    name: 'Scientific Computing',
    items: [
      'Monte Carlo simulation',
      'Numerical integration',
      'Optimization',
      'Reproducible workflows',
      'Testing',
      'CMake',
      'pytest',
    ],
  },
  {
    id: 'quant',
    name: 'Quantitative Finance',
    items: [
      'Black–Scholes',
      'Heston',
      'GARCH',
      'EWMA',
      'Stochastic processes',
      'Portfolio backtesting',
      'Transaction costs',
      'Risk metrics',
      'Drawdown',
      'Sharpe ratio',
      'Monte Carlo pricing',
    ],
  },
  {
    id: 'data-eng',
    name: 'Data Engineering',
    items: [
      'Microsoft Fabric',
      'Power BI',
      'SQL',
      'Microsoft Purview',
      'Data quality rules',
      'Reporting automation',
    ],
  },
  {
    id: 'soft',
    name: 'Research & Communication',
    items: [
      'Academic research',
      'Technical communication',
      'Cross-disciplinary teamwork',
      'Structured problem-solving',
    ],
  },
]
