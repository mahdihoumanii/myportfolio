/** KaTeX source strings used as visual accents — a few, never a wall. */
export interface Equation {
  tex: string
  label: string
}

export const researchEquations: Equation[] = [
  {
    tex: 'd\\sigma_{pp \\to t\\bar{t}+X} = \\sum_{i,j} \\int dx_1\\, dx_2\\; f_i(x_1, \\mu_F)\\, f_j(x_2, \\mu_F)\\; d\\hat{\\sigma}_{ij}(x_1 x_2 s;\\, \\mu_R, \\mu_F)',
    label: 'Collinear factorisation: hadron-level cross sections from partonic ones',
  },
  {
    tex: '\\mu^2 \\frac{d\\alpha_s}{d\\mu^2} = \\beta(\\alpha_s) = -\\alpha_s^2\\left(b_0 + b_1 \\alpha_s + \\cdots\\right)',
    label: 'The running of the strong coupling',
  },
]

export const bridgeEquation: Equation = {
  tex: '\\mathbb{E}[\\Phi] = \\int \\Phi(x)\\, p(x)\\, dx \\;\\approx\\; \\frac{1}{N} \\sum_{i=1}^{N} \\Phi(x_i), \\qquad \\mathrm{err} \\sim \\frac{\\sigma_\\Phi}{\\sqrt{N}}',
  label: 'The same estimator prices a derivative and integrates a phase space',
}

export const quantEquations: Equation[] = [
  {
    tex: 'p[x] \\propto e^{-A[x]}, \\qquad A[x] = \\sum_{i} \\frac{\\left(x_{i+1} - x_i - a\\,\\Delta t\\right)^2}{2 \\sigma^2 \\Delta t}',
    label: 'Path-integral weight of a discretised log-price path',
  },
  {
    tex: '\\widehat{V} = e^{-rT}\\, \\frac{1}{M} \\sum_{m=1}^{M} \\Phi[x^{(m)}]\\, \\frac{p[x^{(m)}]}{q[x^{(m)}]}',
    label: 'Importance-sampling estimator for rare payoffs',
  },
]
