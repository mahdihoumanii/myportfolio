import { Fragment } from 'react'
import Section from './shared/Section'
import ProjectCard from './ProjectCard'
import CompactCard from './CompactCard'
import GlasAlgorithm from './GlasAlgorithm'
import AmplitudeLabs from './AmplitudeLabs'
import Glow from './shared/Glow'
import { physicsFeatured, physicsCompact } from '../data/projects'

export default function PhysicsProjects() {
  return (
    <Section
      id="physics-projects"
      eyebrow="Part III · The Instruments"
      title="Software built to compute the Standard Model"
      lede="Precision QCD lives or dies by its software. These are frameworks and calculations I built — each validated against an independent reference before any result was trusted."
    >
      <Glow color="var(--color-accent)" className="top-1/3 -left-40 h-[460px] w-[460px]" />
      <Glow color="var(--color-red)" className="-right-32 bottom-20 h-[380px] w-[380px]" />
      <div className="flex flex-col gap-14 md:gap-20">
        {physicsFeatured.map((p, i) => (
          <Fragment key={p.slug}>
            <ProjectCard
              project={p}
              index={i}
              serial={`RS-${String(i + 1).padStart(2, '0')}`}
              visual={p.slug === 'glas' ? <GlasAlgorithm /> : undefined}
            />
            {p.slug === 'glas' && <AmplitudeLabs />}
          </Fragment>
        ))}
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 md:mt-16">
        {physicsCompact.map((p, i) => (
          <CompactCard
            key={p.slug}
            project={p}
            index={i}
            serial={`RS-${String(i + 1 + physicsFeatured.length).padStart(2, '0')}`}
          />
        ))}
      </div>
    </Section>
  )
}
