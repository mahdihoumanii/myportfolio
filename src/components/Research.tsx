import Section from './shared/Section'
import Tag from './shared/Tag'
import Equation from './shared/Equation'
import Glow from './shared/Glow'
import StandardModel from './StandardModel'
import { researchEquations } from '../data/equations'

const topics = [
  'Perturbative QCD',
  'Scattering amplitudes',
  'Higher-order corrections',
  'Top-quark pair production',
  'Infrared factorization',
  'Subtraction methods',
  'Power corrections',
  'Loop integrals',
  'Differential equations',
  'Precision SM phenomenology',
  'Collider calculations',
]

export default function Research() {
  return (
    <Section
      id="research"
      eyebrow="02 · Research — Theoretical Particle Physics"
      title="Precision QCD for the top quark"
      lede="My scientific home is perturbative quantum field theory: computing collider observables — especially for processes like pp → tt̄g — precisely enough that experiment can tell us something new."
    >
      <Glow color="var(--color-amber)" className="-top-20 right-0 h-[420px] w-[420px]" />
      <Glow color="var(--color-violet)" className="bottom-0 -left-40 h-[380px] w-[380px]" />
      <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:gap-14">
        <div>
          <p className="text-[15px] leading-relaxed text-muted">
            At RWTH Aachen I worked in the group of <span className="text-fg">Prof. Michał Czakon</span>{' '}
            (Institute for Theoretical Particle Physics and Cosmology) on precision calculations for
            top-quark pair production: analytic tree-level and one-loop massive five-point
            amplitudes, soft and collinear limits beyond leading power via the Low–Burnett–Kroll
            theorem and expansion by regions, and small transverse-momentum power corrections —
            with finite-field reconstruction where direct symbolic computation becomes infeasible,
            and everything validated against MadGraph5_aMC@NLO.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            I am now starting a PhD in Siegen with <span className="text-fg">Prof. Wolfgang Kilian</span>,
            funded by the Cluster of Excellence <span className="text-fg">“Color Meets Flavour”</span> —
            continuing in top-quark physics with direct connections to CERN/LHC phenomenology.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {topics.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>

          <div className="mt-8 rounded-lg border border-accent/25 bg-accent/5 p-5">
            <p className="font-mono text-[11px] tracking-widest text-accent uppercase">PhD · Siegen</p>
            <p className="mt-2 text-sm leading-relaxed text-fg/90">
              University of Siegen · Prof. Wolfgang Kilian · Cluster of Excellence “Color Meets
              Flavour” · top-quark physics & precision Standard Model phenomenology
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <StandardModel />
          {researchEquations.map((eq) => (
            <Equation key={eq.label} eq={eq} />
          ))}
          <p className="font-mono text-[11px] leading-relaxed text-faint">
            Precision means controlling every term you claim — and stating the uncertainty on
            everything you don’t.
          </p>
        </div>
      </div>
    </Section>
  )
}
