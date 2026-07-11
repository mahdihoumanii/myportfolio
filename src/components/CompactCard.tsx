import { motion, useReducedMotion } from 'framer-motion'
import Tag from './shared/Tag'
import FigureSlot from './shared/FigureSlot'
import type { Project } from '../data/projects'

export default function CompactCard({
  project,
  index,
  serial,
}: {
  project: Project
  index: number
  serial: string
}) {
  const reduce = useReducedMotion()

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 2) * 0.08, ease: 'easeOut' }}
      className="flex min-w-0 flex-col rounded-sm border border-line bg-ink-2/50 p-6 transition-colors hover:border-accent/40"
    >
      {project.figure && (
        <div className="mb-5">
          <FigureSlot figure={project.figure} />
        </div>
      )}

      <p className="font-mono text-[11px] tracking-[0.2em] text-faint uppercase">
        <span className="text-accent">{serial}</span> · {project.domain}
      </p>

      <h3 className="mt-2 font-serif text-xl font-semibold text-fg sm:text-2xl">
        {project.title}
      </h3>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
        {project.summary}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.points.map((pt) => (
          <Tag key={pt}>{pt}</Tag>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 font-mono text-[11px] text-faint">
        <span>{project.stack.join(' · ')}</span>

        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="text-accent hover:underline"
          >
            source ↗
          </a>
        )}
      </div>
    </motion.article>
  )
}