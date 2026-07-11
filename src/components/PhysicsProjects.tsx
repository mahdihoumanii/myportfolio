import Section from './shared/Section'
import ProjectCard from './ProjectCard'
import CompactCard from './CompactCard'
import GlasAlgorithm from './GlasAlgorithm'
import Glow from './shared/Glow'
import { physicsFeatured, physicsCompact } from '../data/projects'

export default function PhysicsProjects() {
  return (
    <Section
      id="physics-projects"
      eyebrow="03 · Research Software & Physics Projects"
      title="Tools built to compute the Standard Model"
      lede="Precision QCD lives or dies by its software. These are frameworks and calculations I built — each validated against an independent reference before any result was trusted."
    >
      <Glow color="var(--color-amber)" className="top-1/3 -left-40 h-[460px] w-[460px]" />
      <Glow color="var(--color-rose)" className="-right-32 bottom-20 h-[380px] w-[380px]" />
      <div className="flex flex-col gap-10 md:gap-14">
        {physicsFeatured.map((p, i) => (
          <ProjectCard
            key={p.slug}
            project={p}
            index={i}
            visual={p.slug === 'glas' ? <GlasAlgorithm /> : undefined}
          />
        ))}
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 md:mt-14">
        {physicsCompact.map((p, i) => (
          <CompactCard key={p.slug} project={p} index={i} />
        ))}
      </div>
    </Section>
  )
}
