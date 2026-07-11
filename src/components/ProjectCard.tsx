import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import Tag from './shared/Tag'
import FigureSlot from './shared/FigureSlot'
import type { Project } from '../data/projects'

interface ProjectCardProps {
  project: Project
  index: number
  /** Custom visual (e.g. an algorithm block) instead of a figure. */
  visual?: ReactNode
}

export default function ProjectCard({ project, index, visual }: ProjectCardProps) {
  const reduce = useReducedMotion()
  const flipped = index % 2 === 1

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="grid items-center gap-8 rounded-xl border border-line bg-ink-2/60 p-6 sm:p-8 md:grid-cols-2 md:gap-12"
    >
      <div className={flipped ? 'md:order-2' : ''}>
        <p className="font-mono text-xs tracking-widest text-faint uppercase">
          <span className="text-accent">{String(index + 1).padStart(2, '0')}</span> · {project.domain}
        </p>
        <h3 className="mt-3 text-xl font-semibold tracking-tight text-fg sm:text-2xl">{project.title}</h3>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">{project.summary}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.points.map((pt) => (
            <Tag key={pt}>{pt}</Tag>
          ))}
        </div>

        <blockquote className="mt-6 border-l-2 border-accent/60 pl-4 text-sm leading-relaxed text-fg/85 italic">
          {project.conclusion}
        </blockquote>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <p className="font-mono text-xs text-faint">{project.stack.join(' · ')}</p>
          {project.github ? (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs text-accent hover:underline"
            >
              source ↗
            </a>
          ) : (
            <span className="font-mono text-[11px] text-faint/70" title="Add the repository URL in src/data/projects.ts">
              [repo link pending]
            </span>
          )}
        </div>
      </div>

      <div className={flipped ? 'md:order-1' : ''}>
        {visual ? (
          visual
        ) : project.figure ? (
          <FigureSlot figure={project.figure} />
        ) : (
          <div className="grid-bg flex aspect-[16/10] items-center justify-center rounded-lg border border-line bg-ink-2">
            <p className="font-mono text-xs text-faint">{project.domain.toLowerCase()}</p>
          </div>
        )}
      </div>
    </motion.article>
  )
}
