/**
 * Monte Carlo European option pricing under GBM — a TypeScript port of the
 * estimator in the volatility-options-quant repo (src/options/monte_carlo.py):
 * terminal GBM sampling, discounted-payoff mean, SE with ddof=1, 95% CI as
 * ±1.96·SE, Black–Scholes closed form as the analytic reference.
 */

export interface McParams {
  spot: number
  strike: number
  rate: number
  vol: number
  maturity: number
  optionType: 'call' | 'put'
  /** log2 of the number of paths */
  log2Paths: number
  seed: number
}

export interface Checkpoint {
  n: number
  price: number
  halfWidth: number
}

export interface McResult {
  price: number
  stderr: number
  ciLow: number
  ciHigh: number
  paths: number
  bs: number
  /** running estimate at powers of two, for the convergence plot */
  checkpoints: Checkpoint[]
  elapsedMs: number
}

/** mulberry32 — small deterministic PRNG so results are reproducible. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** standard normal via Box–Muller (both variates used) */
function makeGaussian(rand: () => number): () => number {
  let spare: number | null = null
  return () => {
    if (spare !== null) {
      const v = spare
      spare = null
      return v
    }
    let u = 0
    let v = 0
    while (u === 0) u = rand()
    while (v === 0) v = rand()
    const r = Math.sqrt(-2 * Math.log(u))
    spare = r * Math.sin(2 * Math.PI * v)
    return r * Math.cos(2 * Math.PI * v)
  }
}

/** Φ(x) via the Abramowitz–Stegun erf approximation (|err| < 1.5e-7). */
export function normCdf(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x))
  const d = 0.3989422804014327 * Math.exp((-x * x) / 2)
  const p = d * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))))
  return x >= 0 ? 1 - p : p
}

export function blackScholes(p: Omit<McParams, 'log2Paths' | 'seed'>): number {
  const { spot, strike, rate, vol, maturity, optionType } = p
  const sqT = Math.sqrt(maturity)
  const d1 = (Math.log(spot / strike) + (rate + 0.5 * vol * vol) * maturity) / (vol * sqT)
  const d2 = d1 - vol * sqT
  const df = Math.exp(-rate * maturity)
  return optionType === 'call'
    ? spot * normCdf(d1) - strike * df * normCdf(d2)
    : strike * df * normCdf(-d2) - spot * normCdf(-d1)
}

export function priceMc(params: McParams): McResult {
  const t0 = performance.now()
  const { spot, strike, rate, vol, maturity, optionType, seed } = params
  const nPaths = 2 ** params.log2Paths
  const gauss = makeGaussian(mulberry32(seed))

  const drift = (rate - 0.5 * vol * vol) * maturity
  const diffusion = vol * Math.sqrt(maturity)
  const df = Math.exp(-rate * maturity)

  // Welford running mean/variance so CI checkpoints are cheap
  let mean = 0
  let m2 = 0
  const checkpoints: Checkpoint[] = []
  let nextCheckpoint = 256

  for (let i = 1; i <= nPaths; i++) {
    const sT = spot * Math.exp(drift + diffusion * gauss())
    const payoff = df * Math.max(optionType === 'call' ? sT - strike : strike - sT, 0)
    const delta = payoff - mean
    mean += delta / i
    m2 += delta * (payoff - mean)
    if (i === nextCheckpoint || i === nPaths) {
      const se = i > 1 ? Math.sqrt(m2 / (i - 1) / i) : 0
      checkpoints.push({ n: i, price: mean, halfWidth: 1.96 * se })
      nextCheckpoint *= 2
    }
  }

  const stderr = Math.sqrt(m2 / (nPaths - 1) / nPaths)
  const half = 1.96 * stderr
  return {
    price: mean,
    stderr,
    ciLow: mean - half,
    ciHigh: mean + half,
    paths: nPaths,
    bs: blackScholes(params),
    checkpoints,
    elapsedMs: performance.now() - t0,
  }
}
