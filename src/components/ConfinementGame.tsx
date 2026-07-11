import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * "Try to free a quark" — colour confinement as a game you cannot win.
 * Drag the antiquark away from its partner: the gluon flux tube stores
 * energy linearly (V ≈ σ·r), until pair creation becomes cheaper than
 * more string — snap: two mesons, still zero free quarks.
 */

const VB_W = 720
const VB_H = 170
const Y = 78
const Q_X = 110 // fixed quark
const REST_X = 210 // antiquark rest position
const MAX_X = 660
const SNAP_SEP = 330 // separation at which the string breaks
const SIGMA = 0.9 // GeV/fm — QCD string tension
const PX_PER_FM = 180

const VIOLET = 'var(--color-violet)'
const GOLD = 'var(--color-accent)'
const COPPER = 'var(--color-orange)'
const OXBLOOD = 'var(--color-red)'
const FAINT = 'var(--color-faint)'

function coil(x1: number, x2: number, y: number, r: number): string {
  const len = x2 - x1
  if (len <= 4) return `M ${x1} ${y} L ${x2} ${y}`
  const loops = Math.max(2, Math.round(len / 24))
  const pts: string[] = []
  const N = 30 * loops
  for (let i = 0; i <= N; i++) {
    const t = i / N
    const w = 2 * Math.PI * loops * t
    pts.push(
      `${i === 0 ? 'M' : 'L'} ${(x1 + t * len - r * Math.sin(w) * 0.9).toFixed(1)} ${(y - r * (1 - Math.cos(w)) * 0.9 + r).toFixed(1)}`,
    )
  }
  return pts.join(' ')
}

const snapLines = [
  'SNAP — the stored energy just bought a brand-new quark–antiquark pair from the vacuum. You now own two mesons and zero free quarks.',
  'Again! More string means more energy means… another pair. Still two hadrons, still nothing free.',
  'Confinement: the house always wins. No experiment has ever seen a lone quark — and neither will you.',
]

export default function ConfinementGame() {
  const reduce = useReducedMotion()
  const svgRef = useRef<SVGSVGElement>(null)
  const [x, setX] = useState(REST_X)
  const [dragging, setDragging] = useState(false)
  const [snapped, setSnapped] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const sep = x - Q_X
  const tension = Math.min(1, (sep - (REST_X - Q_X)) / (SNAP_SEP - (REST_X - Q_X)))
  const energy = SIGMA * (sep / PX_PER_FM)
  const tubeColor = tension < 0.45 ? GOLD : tension < 0.8 ? COPPER : OXBLOOD

  const toSvgX = (clientX: number) => {
    const rect = svgRef.current!.getBoundingClientRect()
    return ((clientX - rect.left) / rect.width) * VB_W
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (snapped) return
    const px = toSvgX(e.clientX)
    if (Math.abs(px - x) < 45) {
      setDragging(true)
      ;(e.target as Element).setPointerCapture?.(e.pointerId)
    }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || snapped) return
    const px = Math.max(REST_X, Math.min(MAX_X, toSvgX(e.clientX)))
    setX(px)
    if (px - Q_X >= SNAP_SEP) {
      setDragging(false)
      setSnapped(true)
      setAttempts((a) => a + 1)
      setTimeout(() => {
        setSnapped(false)
        setX(REST_X)
      }, 1200)
    }
  }
  const onPointerUp = () => {
    if (dragging && !snapped) {
      setDragging(false)
      setX(REST_X)
    }
  }

  const mid = Q_X + sep / 2

  return (
    <div className="mt-16 border-t border-line pt-8 md:pt-10">
      <p className="font-mono text-xs tracking-[0.2em] text-faint uppercase">
        <span className="text-cyan">LAB-01</span> · Interactive · a game you cannot win
      </p>
      <h3 className="mt-4 font-serif text-2xl font-semibold tracking-tight text-fg sm:text-[2rem]">
        Try to free a quark
      </h3>
      <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted">
        Unlike every other force, the strong force does not fade with distance — the gluon field
        collapses into a flux tube and the energy grows linearly, V(r) ≈ σ·r. Drag the antiquark
        and see how far you get.
      </p>

      <div className="mt-6 rounded-sm border border-line bg-ink-2/50 p-4">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="w-full cursor-grab touch-none select-none active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          role="application"
          aria-label="Drag the antiquark to attempt to separate a quark pair"
        >
          {/* energy meter */}
          <rect x={Q_X} y="18" width={MAX_X - Q_X} height="3" fill="var(--color-line)" rx="1.5" />
          <motion.rect
            x={Q_X}
            y="18"
            height="3"
            rx="1.5"
            animate={{ width: Math.max(0, (sep / SNAP_SEP) * (MAX_X - Q_X) * 0.62) }}
            transition={{ duration: 0.1 }}
            fill={tubeColor}
          />
          <text x={Q_X} y="40" fontSize="10.5" fill={FAINT} className="font-mono">
            V(r) = σ·r ≈ {energy.toFixed(2)} GeV
          </text>
          <text x={MAX_X} y="40" fontSize="10.5" fill={FAINT} textAnchor="end" className="font-mono">
            attempts {attempts} · free quarks 0
          </text>

          {!snapped ? (
            <>
              {/* flux tube */}
              <motion.path
                d={coil(Q_X + 10, x - 10, Y, 4.5)}
                fill="none"
                stroke={tubeColor}
                strokeWidth={1.2 + tension * 1.2}
                animate={{ opacity: 0.85 + tension * 0.15 }}
                style={{ filter: tension > 0.8 ? `drop-shadow(0 0 6px ${OXBLOOD})` : undefined }}
              />
              {/* quark */}
              <circle cx={Q_X} cy={Y} r="9" fill={VIOLET} opacity="0.9" />
              <text x={Q_X} y={Y + 30} fontSize="12" fill={VIOLET} textAnchor="middle" className="font-serif" fontStyle="italic">q</text>
              {/* antiquark (draggable) */}
              <motion.g animate={reduce ? undefined : { x: dragging ? 0 : [0, 0] }}>
                <circle cx={x} cy={Y} r="9" fill="none" stroke={VIOLET} strokeWidth="2.5" />
                <circle cx={x} cy={Y} r="17" fill={VIOLET} opacity={dragging ? 0.15 : 0.07} />
                <text x={x} y={Y + 30} fontSize="12" fill={VIOLET} textAnchor="middle" className="font-serif" fontStyle="italic">q̄</text>
                {!dragging && (
                  <text x={x + 26} y={Y + 4} fontSize="11" fill={FAINT} className="font-mono">⟵ drag</text>
                )}
              </motion.g>
            </>
          ) : (
            <>
              {/* the string broke: two mesons */}
              <motion.circle
                initial={reduce ? false : { opacity: 0.9, scale: 0.5 }}
                animate={{ opacity: 0, scale: 3 }}
                transition={{ duration: 0.8 }}
                cx={mid}
                cy={Y}
                r="12"
                fill={GOLD}
              />
              <motion.g
                initial={reduce ? false : { x: 0 }}
                animate={{ x: -24 }}
                transition={{ type: 'spring', stiffness: 60, damping: 12 }}
              >
                <path d={coil(Q_X + 10, mid - 34, Y, 4.5)} fill="none" stroke={GOLD} strokeWidth="1.2" />
                <circle cx={Q_X} cy={Y} r="9" fill={VIOLET} opacity="0.9" />
                <circle cx={mid - 24} cy={Y} r="9" fill="none" stroke={VIOLET} strokeWidth="2.5" />
                <text x={(Q_X + mid - 24) / 2} y={Y + 34} fontSize="10.5" fill={FAINT} textAnchor="middle" className="font-mono">meson № 1</text>
              </motion.g>
              <motion.g
                initial={reduce ? false : { x: 0 }}
                animate={{ x: 24 }}
                transition={{ type: 'spring', stiffness: 60, damping: 12 }}
              >
                <path d={coil(mid + 34, x - 10, Y, 4.5)} fill="none" stroke={GOLD} strokeWidth="1.2" />
                <circle cx={mid + 24} cy={Y} r="9" fill={VIOLET} opacity="0.9" />
                <circle cx={x} cy={Y} r="9" fill="none" stroke={VIOLET} strokeWidth="2.5" />
                <text x={(mid + 24 + x) / 2} y={Y + 34} fontSize="10.5" fill={FAINT} textAnchor="middle" className="font-mono">meson № 2</text>
              </motion.g>
            </>
          )}
        </svg>

        <p className="mt-2 min-h-[2.5rem] max-w-3xl font-mono text-[11px] leading-relaxed text-muted">
          {snapped
            ? snapLines[(attempts - 1) % snapLines.length]
            : dragging
              ? 'the flux tube does not thin out. it just… keeps charging you.'
              : attempts === 0
                ? 'grab the hollow antiquark and pull it to the right. how hard can it be?'
                : 'go on — try again. the vacuum has infinite inventory.'}
        </p>
      </div>
    </div>
  )
}
