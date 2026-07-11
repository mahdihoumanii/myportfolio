import { motion, useReducedMotion } from 'framer-motion'

/**
 * A restrained financial-data motif: muted candlesticks, a brass equity
 * curve drawing itself in, and a soft volatility band. Continues the hero's
 * story — the same stochastic paths, now priced.
 */

// deterministic pseudo-market data (no Math.random — stable render)
const closes = [62, 60, 64, 63, 67, 65, 70, 68, 66, 71, 74, 72, 77, 75, 80, 78, 83, 86, 84, 90]
const W = 800
const H = 150
const X0 = 10
const DX = (W - 40) / (closes.length - 1)
const y = (v: number) => H - 18 - v

const equityPath = closes.map((c, i) => `${i === 0 ? 'M' : 'L'} ${X0 + i * DX} ${y(c)}`).join(' ')
const bandPath =
  closes.map((c, i) => `${i === 0 ? 'M' : 'L'} ${X0 + i * DX} ${y(c + 9 + 3 * Math.sin(i))}`).join(' ') +
  ' ' +
  [...closes]
    .map((c, i) => ({ c, i }))
    .reverse()
    .map(({ c, i }, k) => `${k === 0 ? 'L' : 'L'} ${X0 + i * DX} ${y(c - 9 - 3 * Math.sin(i))}`)
    .join(' ') +
  ' Z'

export default function MarketMotif() {
  const reduce = useReducedMotion()
  return (
    <div className="mb-12 overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[560px]" aria-hidden>
        {/* volatility band */}
        <motion.path
          d={bandPath}
          fill="var(--color-accent)"
          initial={reduce ? undefined : { opacity: 0 }}
          whileInView={{ opacity: 0.07 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.2, delay: 0.8 }}
        />
        {/* candles */}
        {closes.map((c, i) => {
          if (i === 0) return null
          const up = c >= closes[i - 1]
          const color = up ? 'var(--color-green)' : 'var(--color-red)'
          const x = X0 + i * DX
          const top = Math.min(y(c), y(closes[i - 1]))
          const h = Math.max(3, Math.abs(y(c) - y(closes[i - 1])))
          return (
            <motion.g
              key={i}
              initial={reduce ? undefined : { opacity: 0 }}
              whileInView={{ opacity: 0.5 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.3, delay: reduce ? 0 : 0.05 * i }}
            >
              <line x1={x} y1={top - 6} x2={x} y2={top + h + 6} stroke={color} strokeWidth="1" opacity="0.5" />
              <rect x={x - 3.5} y={top} width="7" height={h} fill={color} rx="1" />
            </motion.g>
          )
        })}
        {/* equity curve */}
        <motion.path
          d={equityPath}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.8"
          initial={reduce ? undefined : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.6, ease: 'easeInOut' }}
        />
        <text x={X0} y={H - 2} fontSize="11" fill="var(--color-faint)" className="font-mono">
          the same stochastic paths — now with a price, a cost, and an error bar
        </text>
      </svg>
    </div>
  )
}
