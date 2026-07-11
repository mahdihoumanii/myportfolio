import Section from './shared/Section'
import Glow from './shared/Glow'
import { profile } from '../data/profile'

export default function Contact() {
  return (
    <Section
      id="contact"
      eyebrow="08 · Contact"
      title="Let’s talk"
      lede="Open to conversations about research, quantitative modelling, scientific computing, and data science — academic or industry."
    >
      <Glow color="var(--color-orange)" className="-top-10 right-0 h-[420px] w-[420px]" />
      <Glow color="var(--color-amber)" className="bottom-0 -left-24 h-[360px] w-[360px]" />
      <div className="rounded-xl border border-line bg-ink-2/60 p-8 sm:p-10">
        <a
          href={`mailto:${profile.email}`}
          className="font-mono text-lg break-all text-accent hover:underline sm:text-2xl"
        >
          {profile.email}
        </a>
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <a href={profile.github} target="_blank" rel="noreferrer" className="text-muted transition-colors hover:text-accent">
            GitHub ↗
          </a>
          {profile.linkedin ? (
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-muted transition-colors hover:text-accent">
              LinkedIn ↗
            </a>
          ) : (
            <span className="font-mono text-xs text-faint" title="Add your LinkedIn URL in src/data/profile.ts">
              [LinkedIn link pending]
            </span>
          )}
          <span className="text-muted">{profile.location}</span>
        </div>
      </div>
      <p className="mx-auto mt-16 max-w-3xl text-center text-[15px] leading-relaxed text-faint italic">
        “{profile.narrative}”
      </p>
    </Section>
  )
}
