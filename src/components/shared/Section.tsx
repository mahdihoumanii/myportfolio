import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface SectionProps {
  id: string
  eyebrow: string
  title: string
  lede?: string
  children: ReactNode
  className?: string
}

export default function Section({ id, eyebrow, title, lede, children, className = '' }: SectionProps) {
  const reduce = useReducedMotion()
  return (
    <section id={id} className={`relative mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8 md:py-32 ${className}`}>
      <motion.header
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-12 md:mb-16"
      >
        <p className="mb-3 font-mono text-xs tracking-[0.25em] text-accent uppercase">{eyebrow}</p>
        <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-fg sm:text-4xl">{title}</h2>
        {lede && <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{lede}</p>}
      </motion.header>
      {children}
    </section>
  )
}
