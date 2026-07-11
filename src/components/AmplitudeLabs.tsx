import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

/**
 * LAB-02 · The amplitude arcade — four small games about what makes
 * top-quark QCD amplitudes hard, stacked behind a chooser bar:
 *   1. Tame the infrared   — find the divergence, then subtract it away
 *   2. Power corrections   — watch the small-qT expansion earn its keep
 *   3. Never write it down — finite-field reconstruction of a hidden function
 *   4. Count the diagrams  — why automation is not optional
 * The first three are stylized toys with honest shapes; diagram counts for
 * tree/one-loop gg → tt̄ come from GLAS run metadata.
 */

const GOLD = 'var(--color-accent)'
const IVORY = 'var(--color-fg)'
const CYAN = 'var(--color-cyan)'
const EMERALD = 'var(--color-green)'
const COPPER = 'var(--color-orange)'
const OXBLOOD = 'var(--color-red)'
const VIOLET = 'var(--color-violet)'
const FAINT = 'var(--color-faint)'
const LINE = 'var(--color-line)'

/* ================================================================== */
/* 1 · Tame the infrared                                               */
/* ================================================================== */

const IR = { x0: 70, x1: 610, y0: 26, y1: 196 } // pad rect in svg coords
const IR_W = 640
const IR_H = 252

/** stylized |M(tt̄g)|²/|M_Born|²: soft (E→0) and collinear (θ→0) poles */
function irWeight(eFrac: number, thFrac: number, subtracted: boolean): number {
  const E = 0.4 + eFrac * 49.6 // GeV-ish
  const th = (0.5 + thFrac * 89.5) * (Math.PI / 180)
  if (!subtracted) return 420 / (E * E * Math.sin(th) ** 2)
  // dipole removed: finite, mildly θ-dependent remainder
  return (2.2 * (1 + Math.cos(th) ** 2)) / (1 + (E / 18) ** 2) / 3
}

function TameTheInfrared() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [pos, setPos] = useState({ ex: 0.55, th: 0.55 }) // fractions: ex→E, th→θ
  const [subtracted, setSubtracted] = useState(false)
  const [dragging, setDragging] = useState(false)

  const w = irWeight(pos.ex, pos.th, subtracted)
  const logW = Math.log10(Math.max(1e-3, w))
  const hot = !subtracted && logW > 2.6

  const toFrac = (clientX: number, clientY: number) => {
    const r = svgRef.current!.getBoundingClientRect()
    const x = ((clientX - r.left) / r.width) * IR_W
    const y = ((clientY - r.top) / r.height) * IR_H
    return {
      th: Math.min(1, Math.max(0, (x - IR.x0) / (IR.x1 - IR.x0))),
      ex: Math.min(1, Math.max(0, 1 - (y - IR.y0) / (IR.y1 - IR.y0))),
    }
  }

  // coarse heat map, recomputed only when the toggle flips
  const cells = useMemo(() => {
    const out: { x: number; y: number; o: number }[] = []
    const NX = 26
    const NY = 12
    for (let i = 0; i < NX; i++) {
      for (let j = 0; j < NY; j++) {
        const th = (i + 0.5) / NX
        const ex = 1 - (j + 0.5) / NY
        const lw = Math.log10(Math.max(1e-3, irWeight(ex, th, subtracted)))
        out.push({
          x: IR.x0 + (i / NX) * (IR.x1 - IR.x0),
          y: IR.y0 + (j / NY) * (IR.y1 - IR.y0),
          o: Math.min(0.55, Math.max(0.02, (lw + 1) / 9)),
        })
      }
    }
    return out
  }, [subtracted])

  const mx = IR.x0 + pos.th * (IR.x1 - IR.x0)
  const my = IR.y0 + (1 - pos.ex) * (IR.y1 - IR.y0)
  const meterFrac = subtracted ? Math.min(1, Math.max(0.02, (logW + 1) / 4)) : Math.min(1, (logW + 1) / 7)

  return (
    <div>
      <p className="text-sm leading-relaxed text-muted">
        Drag the gluon through emission phase space. Near the edges — soft (bottom) or collinear
        (left) — the tt̄g amplitude diverges. Then switch on the Catani–Seymour dipole and try to
        find the infinity again.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setSubtracted((s) => !s)}
          className={`rounded-sm border px-4 py-1.5 font-mono text-xs transition-colors ${
            subtracted ? 'border-green text-green' : 'border-red/70 text-red'
          }`}
        >
          dipole subtraction: {subtracted ? 'ON' : 'OFF'}
        </button>
        <span className="font-mono text-[11px] text-faint">
          {subtracted ? 'integrand finite everywhere — integrable' : 'raw matrix element — handle with gloves'}
        </span>
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${IR_W} ${IR_H}`}
        className="mt-3 w-full cursor-crosshair touch-none select-none"
        onPointerDown={(e) => {
          setDragging(true)
          setPos(toFrac(e.clientX, e.clientY))
          ;(e.target as Element).setPointerCapture?.(e.pointerId)
        }}
        onPointerMove={(e) => dragging && setPos(toFrac(e.clientX, e.clientY))}
        onPointerUp={() => setDragging(false)}
        onPointerLeave={() => setDragging(false)}
        role="application"
        aria-label="Emission phase space pad"
      >
        {cells.map((c, i) => (
          <rect
            key={i}
            x={c.x}
            y={c.y}
            width={(IR.x1 - IR.x0) / 26 + 0.5}
            height={(IR.y1 - IR.y0) / 12 + 0.5}
            fill={subtracted ? EMERALD : OXBLOOD}
            opacity={c.o}
          />
        ))}
        <rect x={IR.x0} y={IR.y0} width={IR.x1 - IR.x0} height={IR.y1 - IR.y0} fill="none" stroke={LINE} />
        {/* axes */}
        <text x={(IR.x0 + IR.x1) / 2} y={IR_H - 34} textAnchor="middle" fontSize="10.5" fill={FAINT} className="font-mono">
          gluon angle θ → (collinear divergence at the left wall)
        </text>
        <text
          x="24"
          y={(IR.y0 + IR.y1) / 2}
          fontSize="10.5"
          fill={FAINT}
          className="font-mono"
          transform={`rotate(-90 24 ${(IR.y0 + IR.y1) / 2})`}
          textAnchor="middle"
        >
          gluon energy E → (soft at the bottom)
        </text>
        {/* the gluon marker */}
        <circle cx={mx} cy={my} r="14" fill={hot ? OXBLOOD : GOLD} opacity="0.15" />
        <circle cx={mx} cy={my} r="5" fill={hot ? OXBLOOD : GOLD} />
        {/* meter */}
        <rect x={IR.x0} y={IR_H - 22} width={IR.x1 - IR.x0} height="4" fill={LINE} rx="2" />
        <motion.rect
          x={IR.x0}
          y={IR_H - 22}
          height="4"
          rx="2"
          animate={{ width: meterFrac * (IR.x1 - IR.x0) }}
          transition={{ duration: 0.12 }}
          fill={hot ? OXBLOOD : subtracted ? EMERALD : GOLD}
        />
        <text x={IR.x1} y={IR_H - 28} textAnchor="end" fontSize="11" fill={hot ? OXBLOOD : FAINT} className="font-mono">
          |M|²/|M₀|² ≈ 10^{logW.toFixed(1)}{hot ? '  ⚠ divergence' : ''}
        </text>
      </svg>
    </div>
  )
}

/* ================================================================== */
/* 2 · Power corrections                                               */
/* ================================================================== */

const PC_W = 640
const PC_H = 236

function PowerCorrections() {
  const [logR, setLogR] = useState(-1.5) // log10 of r_cut
  const P = { x0: 64, x1: 616, y0: 22, y1: 176 }
  const LR0 = -3
  const LR1 = -0.85

  const lp = (r: number) => 1 - 0.9 * r * -Math.log(r)
  const nlp = (r: number) => 1 - 2.0 * r * r * -Math.log(r)
  const xOf = (lr: number) => P.x0 + ((lr - LR0) / (LR1 - LR0)) * (P.x1 - P.x0)
  const yOf = (v: number) => P.y0 + (1.01 - v) * ((P.y1 - P.y0) / 0.26)

  const path = (f: (r: number) => number) => {
    let d = ''
    for (let i = 0; i <= 120; i++) {
      const lr = LR0 + (i / 120) * (LR1 - LR0)
      d += `${i === 0 ? 'M' : 'L'} ${xOf(lr).toFixed(1)} ${yOf(f(10 ** lr)).toFixed(1)} `
    }
    return d
  }

  const r = 10 ** logR
  const biasLp = (lp(r) - 1) * 100
  const biasNlp = (nlp(r) - 1) * 100

  return (
    <div>
      <p className="text-sm leading-relaxed text-muted">
        qT subtraction cuts the phase space at r = qT/M and hopes the cut is harmless. At leading
        power it isn’t — the missing power corrections bias the cross section. Add the
        next-to-leading-power terms (my thesis) and slide the cut: the bias collapses.
      </p>
      <svg viewBox={`0 0 ${PC_W} ${PC_H}`} className="mt-4 w-full" aria-label="Power correction bias vs cut">
        {/* truth */}
        <line x1={P.x0} x2={P.x1} y1={yOf(1)} y2={yOf(1)} stroke={IVORY} strokeWidth="1" strokeDasharray="4 5" opacity="0.6" />
        <text x={P.x1} y={yOf(1) - 6} textAnchor="end" fontSize="10" fill={FAINT} className="font-mono">exact NLO</text>
        <path d={path(lp)} fill="none" stroke={COPPER} strokeWidth="1.6" />
        <path d={path(nlp)} fill="none" stroke={CYAN} strokeWidth="1.6" />
        <text x={P.x0 + 6} y={yOf(lp(10 ** LR1)) + 2} fontSize="10.5" fill={COPPER} className="font-mono">
          <tspan x={P.x1 - 130} y={yOf(lp(10 ** LR1)) - 4}>leading power</tspan>
        </text>
        <text x={P.x1 - 130} y={yOf(nlp(10 ** LR1)) - 6} fontSize="10.5" fill={CYAN} className="font-mono">+ power corrections</text>
        {/* cut marker */}
        <line x1={xOf(logR)} x2={xOf(logR)} y1={P.y0} y2={P.y1} stroke={GOLD} strokeWidth="1" strokeDasharray="2 4" />
        <circle cx={xOf(logR)} cy={yOf(lp(r))} r="3.2" fill={COPPER} />
        <circle cx={xOf(logR)} cy={yOf(nlp(r))} r="3.2" fill={CYAN} />
        {/* axis */}
        <line x1={P.x0} x2={P.x1} y1={P.y1 + 8} y2={P.y1 + 8} stroke={LINE} />
        {[-3, -2.5, -2, -1.5, -1].map((lr) => (
          <text key={lr} x={xOf(lr)} y={P.y1 + 22} textAnchor="middle" fontSize="9.5" fill={FAINT} className="font-mono">
            {(10 ** lr).toPrecision(1)}
          </text>
        ))}
        <text x={(P.x0 + P.x1) / 2} y={PC_H - 4} textAnchor="middle" fontSize="10.5" fill={FAINT} className="font-mono">
          r_cut = qT / m(tt̄)
        </text>
      </svg>
      <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2">
        <label className="flex min-w-56 flex-1 items-center gap-3">
          <span className="font-mono text-xs whitespace-nowrap text-muted">cut r = {r.toPrecision(2)}</span>
          <input
            type="range"
            min={LR0}
            max={LR1}
            step={0.01}
            value={logR}
            onChange={(e) => setLogR(Number(e.target.value))}
            className="w-full"
            aria-label="qT cut"
          />
        </label>
        <p className="font-mono text-[11px] text-faint">
          bias: <span style={{ color: COPPER }}>{biasLp.toFixed(2)}% LP</span> ·{' '}
          <span style={{ color: CYAN }}>{biasNlp.toFixed(2)}% with PC</span>
        </p>
      </div>
    </div>
  )
}

/* ================================================================== */
/* 3 · Never write it down (finite-field reconstruction)               */
/* ================================================================== */

const FF_W = 640
const FF_H = 232

// hidden "amplitude coefficient": (2x² + x − 3)/(x² − x + 2), pole-free on ℝ
const truthF = (x: number) => (2 * x * x + x - 3) / (x * x - x + 2)

/** least-squares fit of a (2,2) rational function through n samples */
function reconstruct(n: number): (x: number) => number {
  const xs = Array.from({ length: n }, (_, k) => 0.3 + (3.4 * k) / Math.max(1, n - 1))
  const ys = xs.map(truthF)
  // unknowns u = [a0,a1,a2,b1,b2]; a0+a1x+a2x² − y(b1x+b2x²) = y
  const A = xs.map((x, i) => [1, x, x * x, -ys[i] * x, -ys[i] * x * x])
  const b = ys
  const M = Array.from({ length: 5 }, (_, i) =>
    Array.from({ length: 5 }, (_, j) => A.reduce((s, row) => s + row[i] * row[j], 0) + (i === j ? 1e-7 : 0)),
  )
  const v = Array.from({ length: 5 }, (_, i) => A.reduce((s, row, k) => s + row[i] * b[k], 0))
  // gaussian elimination
  for (let c = 0; c < 5; c++) {
    let p = c
    for (let r2 = c + 1; r2 < 5; r2++) if (Math.abs(M[r2][c]) > Math.abs(M[p][c])) p = r2
    ;[M[c], M[p]] = [M[p], M[c]]
    ;[v[c], v[p]] = [v[p], v[c]]
    for (let r2 = c + 1; r2 < 5; r2++) {
      const f = M[r2][c] / M[c][c]
      for (let c2 = c; c2 < 5; c2++) M[r2][c2] -= f * M[c][c2]
      v[r2] -= f * v[c]
    }
  }
  const u = new Array(5).fill(0)
  for (let r2 = 4; r2 >= 0; r2--) {
    let s = v[r2]
    for (let c2 = r2 + 1; c2 < 5; c2++) s -= M[r2][c2] * u[c2]
    u[r2] = s / M[r2][r2]
  }
  return (x: number) => (u[0] + u[1] * x + u[2] * x * x) / (1 + u[3] * x + u[4] * x * x)
}

function FiniteFields() {
  const [n, setN] = useState(3)
  const rec = useMemo(() => reconstruct(n), [n])
  const P = { x0: 56, x1: 620, y0: 18, y1: 186 }
  const X0 = -0.4
  const X1 = 4.2
  const Y0 = -2.1
  const Y1 = 2.6
  const xOf = (x: number) => P.x0 + ((x - X0) / (X1 - X0)) * (P.x1 - P.x0)
  const yOf = (y: number) => P.y1 - ((Math.max(Y0, Math.min(Y1, y)) - Y0) / (Y1 - Y0)) * (P.y1 - P.y0)
  const path = (f: (x: number) => number) => {
    let d = ''
    for (let i = 0; i <= 160; i++) {
      const x = X0 + (i / 160) * (X1 - X0)
      d += `${i === 0 ? 'M' : 'L'} ${xOf(x).toFixed(1)} ${yOf(f(x)).toFixed(1)} `
    }
    return d
  }
  const xs = Array.from({ length: n }, (_, k) => 0.3 + (3.4 * k) / Math.max(1, n - 1))
  const exact = n >= 5
  // max deviation over the plotted window
  const err = Math.max(
    ...Array.from({ length: 60 }, (_, i) => {
      const x = X0 + (i / 59) * (X1 - X0)
      return Math.abs(rec(x) - truthF(x))
    }),
  )

  return (
    <div>
      <p className="text-sm leading-relaxed text-muted">
        A two-loop amplitude coefficient is a rational function too large to ever write down — so we
        never do. We evaluate it at sample points (over finite fields, exactly) and reconstruct it.
        This one has 5 unknown coefficients. Give the machine samples and watch it guess.
      </p>
      <svg viewBox={`0 0 ${FF_W} ${FF_H}`} className="mt-4 w-full" aria-label="Rational reconstruction plot">
        <path d={path(truthF)} fill="none" stroke={IVORY} strokeWidth="1" opacity="0.35" strokeDasharray="5 5" />
        <path d={path(rec)} fill="none" stroke={exact ? EMERALD : GOLD} strokeWidth="1.7" />
        {xs.map((x, i) => (
          <g key={i}>
            <circle cx={xOf(x)} cy={yOf(truthF(x))} r="3.4" fill={CYAN} />
            <line x1={xOf(x)} x2={xOf(x)} y1={yOf(truthF(x)) + 6} y2={P.y1 + 6} stroke={CYAN} strokeWidth="0.6" opacity="0.25" />
          </g>
        ))}
        <line x1={P.x0} x2={P.x1} y1={P.y1 + 8} y2={P.y1 + 8} stroke={LINE} />
        <text x={P.x0 + 4} y={P.y0 + 10} fontSize="10" fill={FAINT} className="font-mono">
          dashed = the hidden truth · solid = the reconstruction · dots = samples
        </text>
      </svg>
      <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2">
        <label className="flex min-w-56 flex-1 items-center gap-3">
          <span className="font-mono text-xs whitespace-nowrap text-muted">samples: {n}</span>
          <input
            type="range"
            min={2}
            max={8}
            step={1}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="w-full"
            aria-label="number of samples"
          />
        </label>
        <p className={`font-mono text-[11px] ${exact ? 'text-green' : 'text-red'}`}>
          {exact
            ? `reconstruction exact: (2x² + x − 3)/(x² − x + 2) ✓ — max deviation ${err.toExponential(1)}`
            : `underdetermined — confidently wrong (max deviation ${err.toFixed(2)})`}
        </p>
      </div>
    </div>
  )
}

/* ================================================================== */
/* 4 · Count the diagrams                                              */
/* ================================================================== */

const stages = [
  { label: 'gg → tt̄ · tree level', count: 3, display: '3', note: 'you can draw these over coffee' },
  { label: 'gg → tt̄ · one loop', count: 28, display: '28', note: 'a determined weekend (GLAS counts these for me)' },
  { label: 'gg → tt̄ · two loops', count: 789, display: '789', note: 'nobody draws these by hand' },
  { label: 'gg → tt̄g · loops + real emission', count: 8000, display: '≈ 10⁴', note: 'this is why GLAS exists' },
]

function DiagramGlyph({ x, y, hue }: { x: number; y: number; hue: string }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity="0.8">
      <circle cx="9" cy="9" r="8" fill="none" stroke={hue} strokeWidth="0.9" />
      <path d="M 3 5 L 9 9 L 3 13 M 15 5 L 9 9 L 15 13" fill="none" stroke={hue} strokeWidth="0.9" />
    </g>
  )
}

function CountTheDiagrams() {
  const reduce = useReducedMotion()
  const [stage, setStage] = useState(0)
  const s = stages[stage]
  const shown = Math.min(s.count, 84)
  const hues = [GOLD, CYAN, VIOLET, OXBLOOD]

  return (
    <div>
      <p className="text-sm leading-relaxed text-muted">
        Every extra loop or leg multiplies the number of Feynman diagrams — and each diagram is
        harder than the last. Slide the order up and watch hand calculation stop being an option.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
        <label className="flex min-w-56 flex-1 items-center gap-3">
          <span className="font-mono text-xs whitespace-nowrap text-muted">perturbative order</span>
          <input
            type="range"
            min={0}
            max={3}
            step={1}
            value={stage}
            onChange={(e) => setStage(Number(e.target.value))}
            className="w-full"
            aria-label="perturbative order"
          />
        </label>
        <p className="font-mono text-xs text-fg">
          {s.label}: <span className="text-accent">{s.display} diagrams</span>
        </p>
      </div>
      <div className="mt-4 min-h-36 rounded-sm border border-line bg-ink/40 p-3">
        <svg viewBox="0 0 640 120" className="w-full" aria-label="Diagram count visual">
          <AnimatePresence>
            {Array.from({ length: shown }, (_, i) => (
              <motion.g
                key={`${stage}-${i}`}
                initial={reduce ? false : { opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: reduce ? 0 : Math.min(0.9, i * 0.012) }}
              >
                <DiagramGlyph x={8 + (i % 21) * 30} y={4 + Math.floor(i / 21) * 29} hue={hues[stage]} />
              </motion.g>
            ))}
          </AnimatePresence>
          {s.count > shown && (
            <text x="632" y="112" textAnchor="end" fontSize="12" fill={OXBLOOD} className="font-mono">
              … + {(s.count - shown).toLocaleString('en-US')} more
            </text>
          )}
        </svg>
      </div>
      <p className="mt-2 font-mono text-[11px] text-faint">
        {s.note} · tree & one-loop counts from GLAS run metadata; higher orders order-of-magnitude
      </p>
    </div>
  )
}

/* ================================================================== */
/* the arcade shell                                                    */
/* ================================================================== */

const games = [
  { id: 'ir', label: 'tame the infrared', component: TameTheInfrared },
  { id: 'pc', label: 'power corrections', component: PowerCorrections },
  { id: 'ff', label: 'never write it down', component: FiniteFields },
  { id: 'count', label: 'count the diagrams', component: CountTheDiagrams },
]

export default function AmplitudeLabs() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState('ir')
  const Game = games.find((g) => g.id === active)!.component

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="border-t border-line pt-8 md:pt-10"
    >
      <p className="font-mono text-xs tracking-[0.2em] text-faint uppercase">
        <span className="text-cyan">LAB-02</span> · Interactive · four things that make amplitudes hard
      </p>
      <h3 className="mt-4 font-serif text-2xl font-semibold tracking-tight text-fg sm:text-[2rem]">
        The amplitude arcade
      </h3>

      <div className="mt-5 flex flex-wrap gap-2">
        {games.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setActive(g.id)}
            className={`rounded-sm border px-3.5 py-1.5 font-mono text-xs transition-colors ${
              active === g.id
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-line text-muted hover:border-accent/40 hover:text-fg'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-sm border border-line bg-ink-2/50 p-4 sm:p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            <Game />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
