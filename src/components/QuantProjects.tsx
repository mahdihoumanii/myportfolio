import Section from './shared/Section'
import ProjectCard from './ProjectCard'
import CompactCard from './CompactCard'
import Equation from './shared/Equation'
import Glow from './shared/Glow'
import { quantFeatured, quantCompact } from '../data/projects'
import { quantEquations } from '../data/equations'

export default function QuantProjects() {
  return (
    <Section
      id="quant-projects"
      eyebrow="05 · Quantitative Finance & Risk"
      title="Stochastic modelling, priced honestly"
      lede="These projects study models and methods — bias-aware backtesting, Monte Carlo pricing, stochastic volatility, uncertainty quantification. None of them claims a money-making strategy; all of them report what the numbers actually support."
    >
      <Glow color="var(--color-accent)" className="top-20 -right-36 h-[440px] w-[440px]" />
      <Glow color="var(--color-green)" className="bottom-1/4 -left-36 h-[400px] w-[400px]" />
      <div className="flex flex-col gap-10 md:gap-14">
        {quantFeatured.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} />
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 md:mt-14 lg:grid-cols-3">
        {quantCompact.map((p, i) => (
          <CompactCard key={p.slug} project={p} index={i} />
        ))}
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {quantEquations.map((eq) => (
          <Equation key={eq.label} eq={eq} />
        ))}
      </div>
    </Section>
  )
}
