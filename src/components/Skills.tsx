import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Section from './shared/Section'
import Glow from './shared/Glow'
import { skillClusters } from '../data/skills'

const CX = 230
const CY = 215
const R = 150

const shortNames: Record<string, string> = {
  theory: 'Theoretical Physics',
  symbolic: 'Symbolic Methods',
  'physics-software': 'Physics Software',
  programming: 'Programming',
  'scientific-computing': 'Scientific Computing',
  quant: 'Quant Finance',
  'data-eng': 'Data Eng.',
  soft: 'Research & Comm.',
}

const clusterColors: Record<string, string> = {
  theory: 'var(--color-violet)',
  symbolic: 'var(--color-accent)',
  'physics-software': 'var(--color-amber)',
  programming: 'var(--color-green)',
  'scientific-computing': 'var(--color-accent)',
  quant: 'var(--color-rose)',
  'data-eng': 'var(--color-amber)',
  soft: 'var(--color-green)',
}

interface NodePos {
  x: number
  y: number
}

const positions: NodePos[] = skillClusters.map((_, i) => {
  const angle = (-90 + (360 / skillClusters.length) * i) * (Math.PI / 180)
  const r = R * (i % 2 === 0 ? 1 : 0.82)
  return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) }
})

export default function Skills() {
  const [selected, setSelected] = useState(skillClusters[0].id)
  const reduce = useReducedMotion()
  const cluster = skillClusters.find((c) => c.id === selected) ?? skillClusters[0]

  return (
    <Section
      id="skills"
      eyebrow="06 · Skills & Methods"
      title="A physicist’s toolkit, end to end"
      lede="From perturbative QCD and finite-field methods to Monte Carlo pricing and data engineering — one connected set of methods. Select a cluster to explore it."
    >
      <Glow color="var(--color-violet)" className="top-10 left-1/4 h-[420px] w-[420px]" />
      <div className="grid items-center gap-10 md:grid-cols-2">
        {/* Constellation (desktop) */}
        <svg
          viewBox="0 0 460 430"
          className="mx-auto hidden w-full max-w-md md:block"
          role="group"
          aria-label="Skill clusters constellation"
        >
          {/* spokes */}
          {positions.map((p, i) => (
            <line
              key={`spoke-${skillClusters[i].id}`}
              x1={CX}
              y1={CY}
              x2={p.x}
              y2={p.y}
              stroke="var(--color-line)"
              strokeWidth="1"
            />
          ))}
          {/* ring links */}
          {positions.map((p, i) => {
            const q = positions[(i + 1) % positions.length]
            return (
              <line
                key={`ring-${skillClusters[i].id}`}
                x1={p.x}
                y1={p.y}
                x2={q.x}
                y2={q.y}
                stroke="var(--color-line)"
                strokeWidth="0.7"
                strokeDasharray="2 5"
              />
            )
          })}
          <circle cx={CX} cy={CY} r="3.5" fill="var(--color-accent)" opacity="0.9" />

          {skillClusters.map((c, i) => {
            const p = positions[i]
            const active = c.id === selected
            const color = clusterColors[c.id] ?? 'var(--color-accent)'
            return (
              <g
                key={c.id}
                onClick={() => setSelected(c.id)}
                onKeyDown={(e) => e.key === 'Enter' && setSelected(c.id)}
                tabIndex={0}
                role="button"
                aria-pressed={active}
                aria-label={c.name}
                className="cursor-pointer outline-none focus-visible:opacity-100"
              >
                {active && <circle cx={p.x} cy={p.y} r="14" fill={color} opacity="0.18" />}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={active ? 7 : 5.5}
                  fill={active ? color : 'var(--color-ink-3)'}
                  stroke={color}
                  strokeWidth="1.3"
                />
                <text
                  x={p.x}
                  y={p.y + (p.y < CY ? -18 : 26)}
                  textAnchor="middle"
                  className="font-mono"
                  fontSize="11.5"
                  fill={active ? color : 'var(--color-muted)'}
                >
                  {shortNames[c.id]}
                </text>
                <text
                  x={p.x}
                  y={p.y + (p.y < CY ? -18 : 26) + 13}
                  textAnchor="middle"
                  className="font-mono"
                  fontSize="9.5"
                  fill="var(--color-faint)"
                >
                  {c.items.length} skills
                </text>
              </g>
            )
          })}
        </svg>

        {/* Cluster chips (mobile) */}
        <div className="flex flex-wrap gap-2 md:hidden">
          {skillClusters.map((c) => {
            const color = clusterColors[c.id] ?? 'var(--color-accent)'
            const active = c.id === selected
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelected(c.id)}
                className={`rounded-full border px-3 py-1.5 font-mono text-xs transition-colors ${
                  active ? '' : 'border-line text-muted hover:text-fg'
                }`}
                style={
                  active
                    ? { borderColor: color, color, background: `color-mix(in srgb, ${color} 10%, transparent)` }
                    : undefined
                }
              >
                {shortNames[c.id]}
              </button>
            )
          })}
        </div>

        {/* Selected cluster detail */}
        <div className="min-h-56 rounded-xl border border-line bg-ink-2/60 p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={cluster.id}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <h3 className="flex items-center gap-2.5 text-lg font-semibold text-fg">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: clusterColors[cluster.id] ?? 'var(--color-accent)' }}
                />
                {cluster.name}
              </h3>
              <ul className="mt-5 flex flex-wrap gap-2.5">
                {cluster.items.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: reduce ? 0 : 0.04 * i, duration: 0.2 }}
                    className="rounded-md border border-line bg-ink-3 px-3 py-1.5 font-mono text-xs text-fg/85"
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Section>
  )
}
