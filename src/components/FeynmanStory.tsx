import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

/**
 * The physics pipeline as a short film in one frame.
 * Take 1 — two protons collide, full stage. Take 2 — the gg → tt̄ diagram
 * draws itself. Take 3 — the measurement builds up. Then the camera pulls
 * back and all three takes settle into a triptych. Replayable.
 * Reduced motion: the finished triptych, no playback.
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
    pts.push(`${i === 0 ? 'M' : 'L'} ${(x1 + ux * along + nx * out).toFixed(1)} ${(y1 + uy * along + ny * out).toFixed(1)}`)
  }
  return pts.join(' ')
}

// ---- act 2 geometry (local coords, centered on 0,0) ----
const gluonTop = coil(-105, -42, -26, -8, 4)
const gluonBottom = coil(-105, 42, -26, 8, 4)
const propagator = coil(-24, 0, 52, 0, 4)

// ---- act 3 geometry (local coords) ----
const bars = [46, 72, 58, 40, 28, 19, 12, 8]
const BAR_W = 20
const BAR_X0 = -58
const BAR_BASE = 62
const theory = bars
  .map((h, i) => `${i === 0 ? 'M' : 'L'} ${BAR_X0 + i * (BAR_W + 3) + BAR_W / 2} ${BAR_BASE - h - 4}`)
  .join(' ')
const dataOff = [3, -4, 2, 5, -3, 2, -2, 3]

// stage & triptych slots (svg coords)
const STAGE = { x: 490, y: 132, scale: 1.5 }
const SLOTS = [
  { x: 150, y: 132, scale: 1 },
  { x: 480, y: 132, scale: 1 },
  { x: 830, y: 132, scale: 1 },
]

const SCENE_TIMES = [0, 3000, 6200, 9400] // scene 1..3 starts, finale
const slates = ['', 'TAKE 01 · THE COLLISION', 'TAKE 02 · THE PREDICTION', 'TAKE 03 · THE MEASUREMENT', 'THE PIPELINE']
const stageCaptions = ['', 'two protons, one crossing', 'the amplitude that predicts it', 'the histogram that tests it', '']

export default function FeynmanStory() {
  const reduce = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { once: true, margin: '-120px' })
  const [scene, setScene] = useState(0)
  const [runId, setRunId] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setScene(4)
      return
    }
    setScene(1)
    const timers = SCENE_TIMES.slice(1).map((t, i) => setTimeout(() => setScene(i + 2), t))
    return () => timers.forEach(clearTimeout)
  }, [inView, reduce, runId])

  // framer helpers: draw a path / fade an element when `on`, with local delay
  const dp = (on: boolean, delay: number, dur = 0.6) => ({
    initial: false as const,
    animate: on ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 },
    transition: on && !reduce ? { duration: dur, delay, ease: 'easeInOut' as const } : { duration: 0 },
  })
  const ap = (on: boolean, delay: number, to = 1) => ({
    initial: false as const,
    animate: on ? { opacity: to } : { opacity: 0 },
    transition: on && !reduce ? { duration: 0.35, delay } : { duration: 0 },
  })

  // group placement per scene
  const place = (actNo: 1 | 2 | 3) => {
    const playing = scene === actNo
    const finale = scene === 4
    const target = playing ? STAGE : finale ? SLOTS[actNo - 1] : STAGE
    const visible = playing || finale
    return {
      initial: false as const,
      animate: { x: target.x, y: target.y, scale: target.scale, opacity: visible ? 1 : 0 },
      transition: reduce ? { duration: 0 } : { duration: 0.7, ease: 'easeInOut' as const },
    }
  }

  const on1 = scene === 1 || scene === 4
  const on2 = scene === 2 || scene === 4
  const on3 = scene === 3 || scene === 4
  // internal delays only while that act is on stage; instant in the finale
  const d1 = scene === 1 ? 1 : 0
  const d2 = scene === 2 ? 1 : 0
  const d3 = scene === 3 ? 1 : 0

  return (
    <div ref={containerRef} className="relative mb-14">
      {/* slate */}
      <div className="mb-2 flex h-5 items-center justify-between">
        <motion.p
          key={`slate-${scene}`}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: scene > 0 ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="font-mono text-[10px] tracking-[0.3em] text-faint uppercase"
        >
          {slates[scene]}
        </motion.p>
        {scene === 4 && !reduce && (
          <button
            type="button"
            onClick={() => {
              setScene(0)
              setRunId((r) => r + 1)
            }}
            className="font-mono text-[10px] tracking-wider text-faint transition-colors hover:text-accent"
          >
            ⟲ replay
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <svg viewBox="0 0 980 280" className="min-w-[720px]" aria-hidden key={runId}>
          {/* ============ ACT 1 · collision (local coords) ============ */}
          <motion.g {...place(1)}>
            <motion.path {...dp(on1, 0 * d1, 0.4)} d="M -130 0 L -72 0" stroke={FAINT} strokeWidth="1" strokeDasharray="3 6" fill="none" />
            <motion.path {...dp(on1, 0 * d1, 0.4)} d="M 130 0 L 72 0" stroke={FAINT} strokeWidth="1" strokeDasharray="3 6" fill="none" />
            {[-54, 54].map((cx) => (
              <motion.g key={cx} {...ap(on1, 0.35 * d1)}>
                <circle cx={cx} cy={0} r="15" fill="none" stroke={GOLD} strokeWidth="1.2" opacity="0.85" />
                <circle cx={cx - 4} cy={-5} r="2" fill={OXBLOOD} />
                <circle cx={cx + 6} cy={-1} r="2" fill={EMERALD} />
                <circle cx={cx - 2} cy={6} r="2" fill={CYAN} />
              </motion.g>
            ))}
            <motion.path {...ap(on1, 0.7 * d1)} d="M -30 -7 l 10 7 -10 7" fill="none" stroke={GOLD} strokeWidth="1.2" />
            <motion.path {...ap(on1, 0.7 * d1)} d="M 30 -7 l -10 7 10 7" fill="none" stroke={GOLD} strokeWidth="1.2" />
            {/* impact flash */}
            <motion.circle
              initial={false}
              animate={
                scene === 1 && !reduce
                  ? { opacity: [0, 0.9, 0], scale: [0.4, 1.6, 2.6] }
                  : { opacity: 0, scale: 0.4 }
              }
              transition={scene === 1 && !reduce ? { duration: 0.9, delay: 1.5, times: [0, 0.35, 1] } : { duration: 0 }}
              cx="0"
              cy="0"
              r="16"
              fill={GOLD}
            />
            <motion.g {...ap(on1, 1.6 * d1)}>
              {[0, 30, 60, 90, 120, 150].map((a) => {
                const rad = (a * Math.PI) / 180
                return (
                  <line
                    key={a}
                    x1={6 * Math.cos(rad)}
                    y1={6 * Math.sin(rad)}
                    x2={14 * Math.cos(rad)}
                    y2={14 * Math.sin(rad)}
                    stroke={GOLD}
                    strokeWidth="1.4"
                    opacity="0.9"
                  />
                )
              })}
              <circle cx="0" cy="0" r="3" fill={GOLD} />
            </motion.g>
          </motion.g>

          {/* ============ ACT 2 · the diagram ============ */}
          <motion.g {...place(2)}>
            <motion.path {...dp(on2, 0 * d2, 0.7)} d={gluonTop} stroke={GOLD} strokeWidth="1.3" fill="none" />
            <motion.path {...dp(on2, 0 * d2, 0.7)} d={gluonBottom} stroke={GOLD} strokeWidth="1.3" fill="none" />
            <motion.path {...dp(on2, 0.75 * d2, 0.5)} d={propagator} stroke={GOLD} strokeWidth="1.3" fill="none" />
            <motion.path {...dp(on2, 1.3 * d2, 0.45)} d="M 54 0 L 118 -52" stroke={IVORY} strokeWidth="1.5" fill="none" />
            <motion.path {...dp(on2, 1.3 * d2, 0.45)} d="M 54 0 L 118 52" stroke={IVORY} strokeWidth="1.5" fill="none" />
            {/* fermion flow: t outgoing, t̄ back toward the vertex */}
            <motion.path {...ap(on2, 1.85 * d2)} d="M 85.7 -20 L 90.7 -29.8 L 80.1 -27" fill="none" stroke={IVORY} strokeWidth="1.2" />
            <motion.path {...ap(on2, 1.85 * d2)} d="M 86.2 32.3 L 81.3 22.5 L 91.9 25.3" fill="none" stroke={IVORY} strokeWidth="1.2" />
            <motion.circle {...ap(on2, 0.8 * d2)} cx="-25" cy="0" r="2.6" fill={GOLD} />
            <motion.circle {...ap(on2, 1.35 * d2)} cx="53" cy="0" r="2.6" fill={GOLD} />
            <motion.g {...ap(on2, 2.0 * d2)}>
              <text x="-122" y="-48" fontSize="14" fill={GOLD} className="font-serif" fontStyle="italic">g</text>
              <text x="-122" y="58" fontSize="14" fill={GOLD} className="font-serif" fontStyle="italic">g</text>
              <text x="126" y="-50" fontSize="14" fill={IVORY} className="font-serif" fontStyle="italic">t</text>
              <text x="126" y="60" fontSize="14" fill={IVORY} className="font-serif" fontStyle="italic">t̄</text>
            </motion.g>
          </motion.g>

          {/* ============ ACT 3 · the measurement ============ */}
          <motion.g {...place(3)}>
            {[22, 34, 46].map((r, i) => (
              <motion.path
                key={r}
                {...dp(on3, (0 + i * 0.12) * d3, 0.4)}
                d={`M ${-118 + r} ${-r * 0.9} A ${r} ${r} 0 0 1 ${-118 + r} ${r * 0.9}`}
                stroke={FAINT}
                strokeWidth="1"
                fill="none"
                opacity="0.7"
              />
            ))}
            {bars.map((h, i) => (
              <motion.rect
                key={i}
                x={BAR_X0 + i * (BAR_W + 3)}
                width={BAR_W}
                initial={false}
                animate={on3 ? { height: h, y: BAR_BASE - h, opacity: 0.28 } : { height: 0, y: BAR_BASE, opacity: 0 }}
                transition={on3 && !reduce ? { duration: 0.35, delay: (0.5 + i * 0.07) * d3 } : { duration: 0 }}
                fill={EMERALD}
              />
            ))}
            <motion.path {...dp(on3, 1.2 * d3, 0.6)} d={theory} stroke={GOLD} strokeWidth="1.4" fill="none" />
            {bars.map((h, i) => {
              const x = BAR_X0 + i * (BAR_W + 3) + BAR_W / 2
              const y = BAR_BASE - h - 4 + dataOff[i]
              return (
                <motion.g key={i} {...ap(on3, (1.9 + i * 0.08) * d3)}>
                  <line x1={x} y1={y - 7} x2={x} y2={y + 7} stroke={CYAN} strokeWidth="1.1" />
                  <circle cx={x} cy={y} r="2.2" fill={CYAN} />
                </motion.g>
              )
            })}
            <motion.path {...dp(on3, 0.4 * d3, 0.4)} d={`M -64 ${BAR_BASE} L 126 ${BAR_BASE}`} stroke={LINE} strokeWidth="1" fill="none" />
          </motion.g>

          {/* ============ finale: connectors + captions ============ */}
          <motion.path {...dp(scene === 4, 0.5, 0.5)} d="M 285 132 C 330 132 340 132 360 132" stroke={LINE} strokeWidth="1" strokeDasharray="2 7" fill="none" />
          <motion.path {...dp(scene === 4, 0.7, 0.5)} d="M 615 132 C 660 132 670 132 692 132" stroke={LINE} strokeWidth="1" strokeDasharray="2 7" fill="none" />
          <motion.g {...ap(scene === 4, 0.9)}>
            <text x="150" y="252" textAnchor="middle" fontSize="11" fill={FAINT} className="font-mono">two protons, one crossing</text>
            <text x="480" y="252" textAnchor="middle" fontSize="11" fill={FAINT} className="font-mono">the amplitude that predicts it</text>
            <text x="830" y="252" textAnchor="middle" fontSize="11" fill={FAINT} className="font-mono">the histogram that tests it</text>
          </motion.g>
        </svg>
      </div>

      {/* stage caption during playback */}
      <div className="pointer-events-none absolute right-0 -bottom-1 left-0 flex justify-center">
        <motion.p
          key={`cap-${scene}`}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: scene >= 1 && scene <= 3 ? 1 : 0, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="font-mono text-[11px] text-muted"
        >
          {stageCaptions[scene]}
        </motion.p>
      </div>
    </div>
  )
}
