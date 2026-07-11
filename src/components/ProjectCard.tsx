import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import Tag from './shared/Tag'
import FigureSlot from './shared/FigureSlot'
import type { Project } from '../data/projects'

interface ProjectCardProps {
  project: Project
  index: number
  /** Research-log serial, e.g. "RS-01" or "QF-02". */
  serial: string
  /** Custom visual (e.g. an algorithm block) instead of a figure. */
  visual?: ReactNode
}

/** Editorial case-study panel: hairline rule, serial, serif title, log line. */
export default function ProjectCard({ project, index, serial, visual }: ProjectCardProps) {
  const reduce = useReducedMotion()
  const flipped = index % 2 === 1

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="border-t border-line pt-8 md:pt-10"
    >
      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
        <div className={`min-w-0 ${flipped ? 'md:order-2' : ''}`}>
          <p className="font-mono text-xs tracking-[0.2em] text-faint uppercase">
            <span className="text-accent">{serial}</span> · {project.domain}
          </p>

          <h3 className="mt-4 font-serif text-2xl font-semibold tracking-tight text-fg sm:text-[2rem] sm:leading-tight">
            {project.title}
          </h3>

          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            {project.summary}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {project.points.map((pt) => (
              <Tag key={pt}>{pt}</Tag>
            ))}
          </div>

          <blockquote className="mt-6 border-l-2 border-accent/70 pl-4 font-serif text-lg leading-relaxed text-fg/90 italic">
            {project.conclusion}
          </blockquote>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] text-faint">
            <span className="text-accent/80">log</span>
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
        </div>

        <div className={`min-w-0 ${flipped ? 'md:order-1' : ''}`}>
          {visual ? (
            visual
          ) : project.figure ? (
            <FigureSlot figure={project.figure} />
          ) : (
            <div className="grid-bg flex aspect-[16/10] items-center justify-center rounded-sm border border-line bg-ink-2">
              <p className="font-mono text-xs text-faint">
                {project.domain.toLowerCase()}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  )
}