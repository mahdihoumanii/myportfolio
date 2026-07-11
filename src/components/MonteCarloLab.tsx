import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { priceMc, type McParams, type McResult } from '../lab/mc'

const defaults: McParams = {
  spot: 100,
  strike: 110,
  rate: 0.03,
  vol: 0.2,
  maturity: 1,
  optionType: 'call',
  log2Paths: 16,
  seed: 7,
}

interface SliderSpec {
  key: 'spot' | 'strike' | 'rate' | 'vol' | 'maturity' | 'log2Paths'
  label: string
  min: number
  max: number
  step: number
  fmt: (v: number) => string
}

const sliders: SliderSpec[] = [
  { key: 'spot', label: 'spot S₀', min: 50, max: 200, step: 1, fmt: (v) => v.toFixed(0) },
  { key: 'strike', label: 'strike K', min: 50, max: 200, step: 1, fmt: (v) => v.toFixed(0) },
  { key: 'vol', label: 'volatility σ', min: 0.05, max: 0.8, step: 0.01, fmt: (v) => `${(v * 100).toFixed(0)}%` },
  { key: 'rate', label: 'rate r', min: 0, max: 0.1, step: 0.005, fmt: (v) => `${(v * 100).toFixed(1)}%` },
  { key: 'maturity', label: 'maturity T', min: 0.1, max: 3, step: 0.05, fmt: (v) => `${v.toFixed(2)}y` },
  { key: 'log2Paths', label: 'paths N', min: 10, max: 20, step: 1, fmt: (v) => `2^${v} = ${(2 ** v).toLocaleString('en-US')}` },
]

function useMcWorker(params: McParams): { result: McResult | null; busy: boolean } {
  const [result, setResult] = useState<McResult | null>(null)
  const [busy, setBusy] = useState(true)
  const workerRef = useRef<Worker | null>(null)
  const idRef = useRef(0)

  useEffect(() => {
    try {
      workerRef.current = new Worker(new URL('../lab/mcWorker.ts', import.meta.url), { type: 'module' })
    } catch {
      workerRef.current = null
    }
    return () => workerRef.current?.terminate()
  }, [])

  useEffect(() => {
    const id = ++idRef.current
    setBusy(true)
    const timer = setTimeout(() => {
      const worker = workerRef.current
      if (worker) {
        worker.onmessage = (e: MessageEvent<{ id: number; result: McResult }>) => {
          if (e.data.id === idRef.current) {
            setResult(e.data.result)
            setBusy(false)
          }
        }
        worker.postMessage({ id, params })
      } else {
        // no-worker fallback: compute on the main thread
        setResult(priceMc(params))
        setBusy(false)
      }
    }, 120)
    return () => clearTimeout(timer)
  }, [params])

  return { result, busy }
}

function ConvergencePlot({ result }: { result: McResult }) {
  const W = 560
  const H = 190
  const PAD = { l: 46, r: 14, t: 12, b: 26 }
  const pts = result.checkpoints
  const xOf = (n: number) => {
    const lo = Math.log2(pts[0].n)
    const hi = Math.log2(pts[pts.length - 1].n)
    return PAD.l + ((Math.log2(n) - lo) / Math.max(1e-9, hi - lo)) * (W - PAD.l - PAD.r)
  }
  const ys = pts.flatMap((p) => [p.price - p.halfWidth, p.price + p.halfWidth]).concat(result.bs)
  const yMin = Math.min(...ys)
  const yMax = Math.max(...ys)
  const span = Math.max(1e-9, yMax - yMin)
  const yOf = (v: number) => PAD.t + (1 - (v - yMin) / span) * (H - PAD.t - PAD.b)

  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.n).toFixed(1)} ${yOf(p.price).toFixed(1)}`).join(' ')
  const band =
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.n).toFixed(1)} ${yOf(p.price + p.halfWidth).toFixed(1)}`).join(' ') +
    [...pts].reverse().map((p) => ` L ${xOf(p.n).toFixed(1)} ${yOf(p.price - p.halfWidth).toFixed(1)}`).join('') +
    ' Z'

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Monte Carlo convergence plot">
      {/* CI band */}
      <path d={band} fill="var(--color-accent)" opacity="0.1" />
      {/* BS reference */}
      <line
        x1={PAD.l}
        x2={W - PAD.r}
        y1={yOf(result.bs)}
        y2={yOf(result.bs)}
        stroke="var(--color-fg)"
        strokeWidth="1"
        strokeDasharray="4 5"
        opacity="0.55"
      />
      <text x={W - PAD.r} y={yOf(result.bs) - 5} textAnchor="end" fontSize="10" fill="var(--color-muted)" className="font-mono">
        Black–Scholes {result.bs.toFixed(3)}
      </text>
      {/* running estimate */}
      <path d={line} fill="none" stroke="var(--color-accent)" strokeWidth="1.6" />
      {pts.map((p) => (
        <circle key={p.n} cx={xOf(p.n)} cy={yOf(p.price)} r="2" fill="var(--color-cyan)" />
      ))}
      {/* axes */}
      <line x1={PAD.l} x2={W - PAD.r} y1={H - PAD.b} y2={H - PAD.b} stroke="var(--color-line)" strokeWidth="1" />
      {pts.filter((_, i) => i % 2 === 0).map((p) => (
        <text key={p.n} x={xOf(p.n)} y={H - PAD.b + 14} textAnchor="middle" fontSize="9.5" fill="var(--color-faint)" className="font-mono">
          2^{Math.log2(p.n)}
        </text>
      ))}
      <text x={PAD.l - 6} y={yOf(yMax)} textAnchor="end" fontSize="9.5" fill="var(--color-faint)" className="font-mono">
        {yMax.toFixed(2)}
      </text>
      <text x={PAD.l - 6} y={yOf(yMin) + 4} textAnchor="end" fontSize="9.5" fill="var(--color-faint)" className="font-mono">
        {yMin.toFixed(2)}
      </text>
      <text x={PAD.l + 4} y={PAD.t + 10} fontSize="10" fill="var(--color-faint)" className="font-mono">
        running estimate ± 95% CI vs N · SE ∝ 1/√N
      </text>
    </svg>
  )
}

export default function MonteCarloLab() {
  const reduce = useReducedMotion()
  const [params, setParams] = useState<McParams>(defaults)
  const { result, busy } = useMcWorker(params)

  const zScore = useMemo(() => {
    if (!result || result.stderr === 0) return null
    return (result.price - result.bs) / result.stderr
  }, [result])

  const set = (key: keyof McParams, value: number | string) =>
    setParams((p) => ({ ...p, [key]: value }))

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="border-t border-line pt-8 md:pt-10"
    >
      <p className="font-mono text-xs tracking-[0.2em] text-faint uppercase">
        <span className="text-cyan">LAB-03</span> · Interactive · runs in your browser
      </p>
      <h3 className="mt-4 font-serif text-2xl font-semibold tracking-tight text-fg sm:text-[2rem]">
        Price an option, watch the error bar shrink
      </h3>
      <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted">
        A faithful TypeScript port of the Monte Carlo estimator from the volatility project: terminal
        GBM sampling, discounted-payoff mean, and a 95% confidence interval (±1.96·SE, ddof = 1) checked
        against the Black–Scholes closed form. Move the parameters — the estimate, its uncertainty, and
        the convergence path update live.
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-[320px_1fr] md:gap-12">
        {/* controls */}
        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex gap-2">
            {(['call', 'put'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => set('optionType', t)}
                className={`rounded-sm border px-4 py-1.5 font-mono text-xs transition-colors ${
                  params.optionType === t
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-line text-muted hover:text-fg'
                }`}
              >
                {t}
              </button>
            ))}
            <button
              type="button"
              onClick={() => set('seed', params.seed + 1)}
              className="ml-auto rounded-sm border border-line px-4 py-1.5 font-mono text-xs text-muted transition-colors hover:border-accent/50 hover:text-accent"
              title="Draw a fresh sample (new RNG seed)"
            >
              resample ↺
            </button>
          </div>

          {sliders.map((s) => (
            <label key={s.key} className="block">
              <span className="flex items-baseline justify-between font-mono text-xs text-muted">
                {s.label}
                <span className="text-fg">{s.fmt(params[s.key])}</span>
              </span>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={params[s.key]}
                onChange={(e) => set(s.key, Number(e.target.value))}
                className="mt-1.5 w-full"
                aria-label={s.label}
              />
            </label>
          ))}
          <p className="font-mono text-[10px] leading-relaxed text-faint">
            seed {params.seed} · deterministic · {result ? `${result.elapsedMs.toFixed(0)} ms` : '—'}
          </p>
        </div>

        {/* results */}
        <div className="min-w-0">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              {
                label: 'MC price',
                value: result ? result.price.toFixed(3) : '…',
                sub: result ? `± ${(1.96 * result.stderr).toFixed(3)}` : '',
                color: 'text-accent',
              },
              {
                label: 'Black–Scholes',
                value: result ? result.bs.toFixed(3) : '…',
                sub: 'closed form',
                color: 'text-fg',
              },
              {
                label: 'std. error',
                value: result ? result.stderr.toFixed(4) : '…',
                sub: result ? `${result.paths.toLocaleString('en-US')} paths` : '',
                color: 'text-fg',
              },
              {
                label: 'z-score',
                value: zScore !== null ? zScore.toFixed(2) : '…',
                sub: zScore !== null ? (Math.abs(zScore) < 1.96 ? 'within 95% CI ✓' : 'outside — resample') : '',
                color: zScore !== null && Math.abs(zScore) < 1.96 ? 'text-green' : 'text-red',
              },
            ].map((stat) => (
              <div key={stat.label} className="rounded-sm border border-line bg-ink-2/50 px-3 py-2.5">
                <p className="font-mono text-[10px] tracking-wider text-faint uppercase">{stat.label}</p>
                <p className={`mt-1 font-mono text-lg ${stat.color} ${busy ? 'opacity-40' : ''}`}>{stat.value}</p>
                <p className="font-mono text-[10px] text-faint">{stat.sub}</p>
              </div>
            ))}
          </div>
          <div className={`mt-5 rounded-sm border border-line bg-ink-2/50 p-4 ${busy ? 'opacity-60' : ''}`}>
            {result ? (
              <ConvergencePlot result={result} />
            ) : (
              <p className="py-16 text-center font-mono text-xs text-faint">sampling…</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
