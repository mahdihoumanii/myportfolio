import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import Section from './shared/Section'
import Tag from './shared/Tag'
import Glow from './shared/Glow'
import { timeline } from '../data/timeline'

export default function Journey() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.7', 'end 0.7'],
  })
  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 24 })

  return (
    <Section
      id="journey"
      eyebrow="01 · Journey"
      title="From Beirut to the LHC"
      lede="One thread runs through every stop: using mathematics and computation to make precise statements about complex systems."
    >
      <Glow color="var(--color-violet)" className="top-20 -right-32 h-[420px] w-[420px]" />
      <ol ref={ref} className="relative ml-2 sm:ml-4">
        {/* worldline */}
        <div className="absolute top-0 bottom-0 left-0 w-px bg-line" aria-hidden />
        <motion.div
          aria-hidden
          style={reduce ? { scaleY: 1 } : { scaleY }}
          className="absolute top-0 bottom-0 left-0 w-px origin-top bg-accent/70"
        />

        {timeline.map((stop, i) => (
          <motion.li
            key={stop.id}
            initial={reduce ? false : { opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className={`relative pl-8 sm:pl-12 ${i < timeline.length - 1 ? 'pb-14 md:pb-20' : ''}`}
          >
            <span
              aria-hidden
              className="absolute top-1.5 -left-[5px] h-[11px] w-[11px] rounded-full border-2 bg-ink"
              style={{
                borderColor: ['var(--color-amber)', 'var(--color-accent)', 'var(--color-violet)', 'var(--color-green)'][
                  i % 4
                ],
              }}
            />
            <p className="font-mono text-xs tracking-widest text-accent uppercase">
              {stop.place} <span className="text-faint">· {stop.period}</span>
            </p>
            <h3 className="mt-2 text-xl font-semibold text-fg sm:text-2xl">{stop.title}</h3>
            <p className="mt-1 text-sm font-medium text-muted">{stop.org}</p>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">{stop.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {stop.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </motion.li>
        ))}
      </ol>
    </Section>
  )
}
