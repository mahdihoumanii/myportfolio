import { motion, useReducedMotion } from 'framer-motion'
import Tag from './shared/Tag'
import FigureSlot from './shared/FigureSlot'
import type { Project } from '../data/projects'

export default function CompactCard({ project, index }: { project: Project; index: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 2) * 0.08, ease: 'easeOut' }}
      className="flex flex-col rounded-xl border border-line bg-ink-2/60 p-6 transition-colors hover:border-accent/30"
    >
      {project.figure && (
        <div className="mb-5">
          <FigureSlot figure={project.figure} />
        </div>
      )}
      <p className="font-mono text-[11px] tracking-widest text-faint uppercase">{project.domain}</p>
      <h3 className="mt-2 text-lg font-semibold text-fg">{project.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{project.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.points.map((pt) => (
          <Tag key={pt}>{pt}</Tag>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] text-faint">{project.stack.join(' · ')}</p>
        {project.github ? (
          <a href={project.github} target="_blank" rel="noreferrer" className="font-mono text-xs text-accent hover:underline">
            source ↗
          </a>
        ) : (
          <span className="font-mono text-[10px] whitespace-nowrap text-faint/70">[repo link pending]</span>
        )}
      </div>
    </motion.article>
  )
}
