import { motion, useReducedMotion } from 'framer-motion'
import Section from './shared/Section'
import Tag from './shared/Tag'
import Equation from './shared/Equation'
import Glow from './shared/Glow'
import { bridgeEquation } from '../data/equations'

const columns = [
  {
    id: 'physics',
    title: 'Particle Physics',
    items: [
      'QCD',
      'Top-quark production',
      'Amplitudes',
      'Phase-space integration',
      'MadGraph',
      'Finite fields',
      'MC event generation',
    ],
    highlight: false,
  },
  {
    id: 'shared',
    title: 'Shared Methods',
    items: [
      'Monte Carlo',
      'Numerical integration',
      'Stochastic simulation',
      'Uncertainty quantification',
      'Benchmark validation',
      'Reproducibility',
      'C++ / Python scientific computing',
    ],
    highlight: true,
  },
  {
    id: 'finance',
    title: 'Quant Finance',
    items: [
      'Stochastic processes',
      'Black–Scholes',
      'Heston',
      'GARCH',
      'Rare-event derivatives',
      'Portfolio risk',
      'Backtesting',
    ],
    highlight: false,
  },
]

// One line, three regimes: a gluon-like coil, a straight propagator,
// and a stochastic path with a drawdown — the site's thesis in a single stroke.
const coil = (() => {
  let d = 'M 10 60'
  for (let i = 0; i < 11; i++) d += ' a 9 9 0 1 1 22 0'
  return d
})()

const propagator = 'M 252 60 L 430 60'

const stochastic = (() => {
  const offs = [-6, 4, -10, -2, 8, -14, -4, -18, -8, -24, -14, -30, -20, -38, -26, -34, -44, -38, -50]
  let d = 'M 430 60'
  offs.forEach((o, i) => {
    d += ` L ${430 + ((i + 1) * 360) / offs.length} ${60 + o}`
  })
  return d
})()

export default function Bridge() {
  const reduce = useReducedMotion()

  const draw = (delay: number) => ({
    initial: reduce ? false : { pathLength: 0 },
    animate: { pathLength: 1 },
    transition: { duration: 1.1, delay, ease: 'easeInOut' as const },
  })

  return (
    <Section
      id="bridge"
      eyebrow="Part IV · The Bridge"
      title="From collisions to markets"
      lede="The transition from scattering amplitudes to derivatives is not a career change — it is the same computational discipline pointed at a different stochastic system."
    >
      <Glow color="var(--color-accent)" className="top-10 -left-32 h-[400px] w-[400px]" />
      <Glow color="var(--color-cyan)" className="-right-24 bottom-0 h-[420px] w-[420px]" />

      {/* the morphing line */}
      <div className="mb-12 overflow-x-auto md:overflow-visible">
        <svg
          viewBox="0 0 800 130"
          className="block h-auto w-[800px] max-w-none md:w-full"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <motion.path
            {...draw(0)}
            d={coil}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2"
            opacity="1"
          />

          <motion.path
            {...draw(0.9)}
            d={propagator}
            fill="none"
            stroke="var(--color-muted)"
            strokeWidth="1.7"
            opacity="0.95"
          />

          <motion.path
            {...draw(1.7)}
            d={stochastic}
            fill="none"
            stroke="var(--color-cyan)"
            strokeWidth="2"
            opacity="1"
          />

          <text x="120" y="110" textAnchor="middle" fontSize="11" fill="var(--color-faint)" className="font-mono">
            gluon exchange
          </text>
          <text x="340" y="110" textAnchor="middle" fontSize="11" fill="var(--color-faint)" className="font-mono">
            propagation
          </text>
          <text x="610" y="110" textAnchor="middle" fontSize="11" fill="var(--color-faint)" className="font-mono">
            stochastic path
          </text>
        </svg>
      </div>

      <p className="max-w-3xl text-[15px] leading-relaxed text-muted">
        Monte Carlo is one of the bridges between my physics and finance work. In particle physics
        it appears in phase-space integration, event simulation, and precision comparisons with
        tools such as MadGraph. In quantitative finance it appears again as stochastic path
        simulation for option pricing, rare-event estimation, variance reduction, volatility
        modelling, and portfolio risk. The domains are different, but the computational discipline
        is the same:{' '}
        <span className="text-fg">
          define the model, sample carefully, estimate uncertainty, validate against benchmarks,
          and avoid fooling yourself.
        </span>
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {columns.map((col) => (
          <div
            key={col.id}
            className={`rounded-xl border p-6 ${
              col.highlight ? 'border-accent/40 bg-accent/5' : 'border-line bg-ink-2/60'
            }`}
          >
            <h3 className={`font-mono text-sm font-medium tracking-wide ${col.highlight ? 'text-accent' : 'text-fg'}`}>
              {col.title}
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {col.items.map((it) => (
                <Tag key={it}>{it}</Tag>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 md:max-w-2xl">
        <Equation eq={bridgeEquation} />
      </div>
    </Section>
  )
}