import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { profile } from '../data/profile'
import HeroCanvas from './HeroCanvas'

function HeroPhoto() {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  return (
    <div
      className="rounded-full p-[3px]"
      style={{
        background:
          'conic-gradient(from 210deg, var(--color-amber), var(--color-orange), var(--color-accent), var(--color-red), var(--color-amber))',
        boxShadow: '0 0 36px color-mix(in srgb, var(--color-accent) 32%, transparent)',
      }}
    >
      <img
        src={`${import.meta.env.BASE_URL}${profile.photoPath}`}
        alt={profile.name}
        onError={() => setFailed(true)}
        className="aspect-square w-28 rounded-full border-4 border-ink object-cover sm:w-44 lg:w-52"
      />
    </div>
  )
}

export default function Hero() {
  const reduce = useReducedMotion()
  const fade = (delay: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 20 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: 'easeOut' as const },
  })

  return (
    <section id="top" className="relative flex min-h-svh items-center overflow-hidden">
      <HeroCanvas />
      {/* readability gradient over the canvas */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col-reverse items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="min-w-0">
            <motion.p {...fade(0.05)} className="mb-5 font-mono text-xs tracking-[0.3em] text-accent uppercase">
              Beirut → Aachen → Siegen → CERN/LHC
            </motion.p>
            <motion.h1
              {...fade(0.15)}
              className="max-w-4xl font-serif text-5xl font-semibold tracking-tight text-fg sm:text-7xl"
            >
              {profile.name}
            </motion.h1>
          </div>
          <motion.div {...fade(0.25)} className="shrink-0 md:pr-4">
            <HeroPhoto />
          </motion.div>
        </div>
        <motion.p {...fade(0.3)} className="mt-5 max-w-3xl font-mono text-sm leading-relaxed text-fg/90 sm:text-base">
          {profile.subtitlePrimary.join('  ·  ')}
        </motion.p>
        <motion.p {...fade(0.38)} className="mt-1.5 max-w-3xl font-mono text-sm leading-relaxed text-muted sm:text-base">
          {profile.subtitleSecondary.join('  ·  ')}
        </motion.p>
        <motion.p {...fade(0.5)} className="mt-6 max-w-2xl text-lg leading-relaxed text-fg/90 sm:text-xl">
          {profile.tagline}
        </motion.p>
        <motion.div {...fade(0.65)} className="mt-10 flex flex-wrap gap-3">
          <a
            href="#research"
            className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-accent/85"
          >
            Research
          </a>
          <a
            href="#physics-projects"
            className="rounded-md border border-line px-5 py-2.5 text-sm font-medium text-fg transition-colors hover:border-accent/50 hover:text-accent"
          >
            Projects
          </a>
          <a
            href="#cv"
            className="rounded-md border border-line px-5 py-2.5 text-sm font-medium text-fg transition-colors hover:border-accent/50 hover:text-accent"
          >
            CV
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-line px-5 py-2.5 text-sm font-medium text-fg transition-colors hover:border-accent/50 hover:text-accent"
          >
            GitHub ↗
          </a>
          <a
            href="#contact"
            className="rounded-md border border-line px-5 py-2.5 text-sm font-medium text-fg transition-colors hover:border-accent/50 hover:text-accent"
          >
            Contact
          </a>
        </motion.div>
      </div>

      <motion.a
        href="#journey"
        aria-label="Scroll to journey"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-faint transition-colors hover:text-accent"
      >
        <svg width="20" height="28" viewBox="0 0 20 28" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M10 4v18M4 16l6 7 6-7" />
        </svg>
      </motion.a>
    </section>
  )
}
