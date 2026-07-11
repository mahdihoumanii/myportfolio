import { motion, useReducedMotion } from 'framer-motion'

/**
 * The physics pipeline in three acts, drawn as one animated strip:
 * two protons collide at the LHC → the gg → tt̄ Feynman diagram that
 * predicts it → the measured distribution with error bars that tests it.
 */

const GOLD = 'var(--color-accent)'
const IVORY = 'var(--color-fg)'
const CYAN = 'var(--color-cyan)'
const EMERALD = 'var(--color-green)'
const OXBLOOD = 'var(--color-red)'
const FAINT = 'var(--color-faint)'
const LINE = 'var(--color-line)'

/** Gluon curl: cycloid sampled into a polyline path between two points. */
function coil(x1: number, y1: number, x2: number, y2: number, loops: number, r = 5.5): string {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy)
  const ux = dx / len
  const uy = dy / len
  const nx = -uy
  const ny = ux
  const pts: string[] = []
  const N = 40 * loops
  for (let i = 0; i <= N; i++) {
    const t = i / N
    const w = 2 * Math.PI * loops * t
    const along = t * len - r * Math.sin(w) * 0.9
    const out = r * (1 - Math.cos(w)) * 0.9
    const x = x1 + ux * along + nx * out
    const y = y1 + uy * along + ny * out
    pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  return pts.join(' ')
}

// ---- act 2: the diagram (gg → tt̄, s-channel) ----
const gluonTop = coil(374, 70, 452, 102, 4)
const gluonBottom = coil(374, 150, 452, 118, 4)
const propagator = coil(455, 110, 530, 110, 4)
const topLine = 'M 532 110 L 596 58'
const antitopLine = 'M 532 110 L 596 162'

// ---- act 3: the measurement ----
const bars = [46, 72, 58, 40, 28, 19, 12, 8]
const BAR_W = 20
const BAR_X0 = 782
const BAR_BASE = 176
const theory = bars
  .map((h, i) => `${i === 0 ? 'M' : 'L'} ${BAR_X0 + i * (BAR_W + 3) + BAR_W / 2} ${BAR_BASE - h - 4}`)
  .join(' ')
// pseudo-data: small deterministic offsets from theory
const dataOff = [3, -4, 2, 5, -3, 2, -2, 3]

export default function FeynmanStory() {
  const reduce = useReducedMotion()

  const draw = (delay: number, dur = 0.7) => ({
    initial: reduce ? undefined : { pathLength: 0 },
    whileInView: { pathLength: 1 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: dur, delay: reduce ? 0 : delay, ease: 'easeInOut' as const },
  })
  const appear = (delay: number, to = 1) => ({
    initial: reduce ? undefined : { opacity: 0 },
    whileInView: { opacity: to },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.4, delay: reduce ? 0 : delay },
  })

  return (
    <div className="mb-14 overflow-x-auto">
      <svg viewBox="0 0 980 230" className="min-w-[760px]" aria-hidden>
        {/* ================= act 1 · collision ================= */}
        {/* beam line */}
        <motion.path {...draw(0, 0.5)} d="M 20 110 L 118 110" stroke={FAINT} strokeWidth="1" strokeDasharray="3 6" fill="none" />
        <motion.path {...draw(0, 0.5)} d="M 262 110 L 168 110" stroke={FAINT} strokeWidth="1" strokeDasharray="3 6" fill="none" />
        {/* protons: three valence quarks in a ring */}
        {[
          { cx: 88, cy: 110 },
          { cx: 196, cy: 110 },
        ].map((p, pi) => (
          <motion.g key={pi} {...appear(0.25 + pi * 0.1)}>
            <circle cx={p.cx} cy={p.cy} r="15" fill="none" stroke={GOLD} strokeWidth="1.2" opacity="0.85" />
            <circle cx={p.cx - 4} cy={p.cy - 5} r="2" fill={OXBLOOD} />
            <circle cx={p.cx + 6} cy={p.cy - 1} r="2" fill={EMERALD} />
            <circle cx={p.cx - 2} cy={p.cy + 6} r="2" fill={CYAN} />
          </motion.g>
        ))}
        {/* arrows toward each other */}
        <motion.path {...appear(0.5)} d="M 112 103 l 10 7 -10 7" fill="none" stroke={GOLD} strokeWidth="1.2" />
        <motion.path {...appear(0.5)} d="M 172 103 l -10 7 10 7" fill="none" stroke={GOLD} strokeWidth="1.2" />
        {/* collision flash */}
        <motion.g {...appear(0.8)}>
          {[0, 30, 60, 90, 120, 150].map((a) => {
            const rad = (a * Math.PI) / 180
            const x1 = 142 + 6 * Math.cos(rad)
            const y1 = 110 + 6 * Math.sin(rad)
            const x2 = 142 + 14 * Math.cos(rad)
            const y2 = 110 + 14 * Math.sin(rad)
            return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke={GOLD} strokeWidth="1.4" opacity="0.9" />
          })}
          <circle cx="142" cy="110" r="3" fill={GOLD} />
        </motion.g>
        {/* hand-off: what actually met was two gluons */}
        <motion.path {...draw(1.0, 0.5)} d="M 160 110 C 240 110 260 110 335 110" stroke={LINE} strokeWidth="1" strokeDasharray="2 7" fill="none" />

        {/* ================= act 2 · the diagram ================= */}
        <motion.path {...draw(1.4)} d={gluonTop} stroke={GOLD} strokeWidth="1.3" fill="none" opacity="0.95" />
        <motion.path {...draw(1.4)} d={gluonBottom} stroke={GOLD} strokeWidth="1.3" fill="none" opacity="0.95" />
        <motion.path {...draw(2.0, 0.5)} d={propagator} stroke={GOLD} strokeWidth="1.3" fill="none" opacity="0.95" />
        <motion.path {...draw(2.4, 0.5)} d={topLine} stroke={IVORY} strokeWidth="1.5" fill="none" />
        <motion.path {...draw(2.4, 0.5)} d={antitopLine} stroke={IVORY} strokeWidth="1.5" fill="none" />
        {/* fermion-flow arrows: t outgoing (away from vertex), t̄ pointing back in */}
        <motion.path {...appear(2.8)} d="M 563.7 90 L 568.7 80.2 L 558.1 83" fill="none" stroke={IVORY} strokeWidth="1.2" />
        <motion.path {...appear(2.8)} d="M 564.2 142.3 L 559.3 132.5 L 569.9 135.3" fill="none" stroke={IVORY} strokeWidth="1.2" />
        {/* vertices */}
        <motion.circle {...appear(2.2)} cx="453" cy="110" r="2.6" fill={GOLD} />
        <motion.circle {...appear(2.4)} cx="531" cy="110" r="2.6" fill={GOLD} />
        {/* labels */}
        <motion.g {...appear(2.9)}>
          <text x="360" y="64" fontSize="14" fill={GOLD} className="font-serif" fontStyle="italic">g</text>
          <text x="360" y="170" fontSize="14" fill={GOLD} className="font-serif" fontStyle="italic">g</text>
          <text x="604" y="58" fontSize="14" fill={IVORY} className="font-serif" fontStyle="italic">t</text>
          <text x="604" y="168" fontSize="14" fill={IVORY} className="font-serif" fontStyle="italic">t̄</text>
        </motion.g>

        {/* hand-off to the detector */}
        <motion.path {...draw(3.0, 0.5)} d="M 615 110 C 670 110 680 110 700 110" stroke={LINE} strokeWidth="1" strokeDasharray="2 7" fill="none" />

        {/* ================= act 3 · the measurement ================= */}
        {/* detector arcs facing the diagram */}
        {[22, 34, 46].map((r, i) => (
          <motion.path
            key={r}
            {...draw(3.2 + i * 0.15, 0.4)}
            d={`M ${712 + r} ${110 - r * 0.9} A ${r} ${r} 0 0 1 ${712 + r} ${110 + r * 0.9}`}
            stroke={FAINT}
            strokeWidth="1"
            fill="none"
            opacity="0.7"
          />
        ))}
        {/* histogram: theory bars, theory curve, data with error bars */}
        {bars.map((h, i) => (
          <motion.rect
            key={i}
            x={BAR_X0 + i * (BAR_W + 3)}
            width={BAR_W}
            initial={reduce ? undefined : { height: 0, y: BAR_BASE }}
            whileInView={{ height: h, y: BAR_BASE - h }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4, delay: reduce ? 0 : 3.7 + i * 0.06 }}
            fill={EMERALD}
            opacity="0.28"
          />
        ))}
        <motion.path {...draw(4.2, 0.7)} d={theory} stroke={GOLD} strokeWidth="1.4" fill="none" />
        {bars.map((h, i) => {
          const x = BAR_X0 + i * (BAR_W + 3) + BAR_W / 2
          const y = BAR_BASE - h - 4 + dataOff[i]
          return (
            <motion.g key={i} {...appear(4.5 + i * 0.07)}>
              <line x1={x} y1={y - 7} x2={x} y2={y + 7} stroke={CYAN} strokeWidth="1.1" />
              <circle cx={x} cy={y} r="2.2" fill={CYAN} />
            </motion.g>
          )
        })}
        {/* axis */}
        <motion.path {...draw(3.6, 0.4)} d={`M 776 ${BAR_BASE} L 966 ${BAR_BASE}`} stroke={LINE} strokeWidth="1" fill="none" />

        {/* act labels */}
        <motion.g {...appear(1.0)}>
          <text x="142" y="216" textAnchor="middle" fontSize="11" fill={FAINT} className="font-mono">two protons, one crossing</text>
        </motion.g>
        <motion.g {...appear(2.9)}>
          <text x="470" y="216" textAnchor="middle" fontSize="11" fill={FAINT} className="font-mono">the amplitude that predicts it</text>
        </motion.g>
        <motion.g {...appear(4.6)}>
          <text x="870" y="216" textAnchor="middle" fontSize="11" fill={FAINT} className="font-mono">the histogram that tests it</text>
        </motion.g>
      </svg>
    </div>
  )
}
