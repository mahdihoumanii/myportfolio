import { useState } from 'react'
import Section from './shared/Section'
import { profile } from '../data/profile'

function Photo() {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div className="flex aspect-square w-24 items-center justify-center rounded-full border border-dashed border-line bg-ink-3 text-center">
        <p className="px-2 font-mono text-[9px] leading-tight text-faint">public/{profile.photoPath}</p>
      </div>
    )
  }
  return (
    <img
      src={`${import.meta.env.BASE_URL}${profile.photoPath}`}
      alt={profile.name}
      onError={() => setFailed(true)}
      className="aspect-square w-24 rounded-full border border-line object-cover"
    />
  )
}

export default function CVSection() {
  const cvHref = `${import.meta.env.BASE_URL}${profile.cvPath}`
  return (
    <Section id="cv" eyebrow="07 · Curriculum Vitae" title="Background at a glance">
      <div className="grid gap-8 md:grid-cols-[1fr_320px]">
        <ol className="flex flex-col gap-6">
          {profile.cvFacts.map((f) => (
            <li key={f.title} className="rounded-xl border border-line bg-ink-2/60 p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold text-fg">{f.title}</h3>
                <p className="font-mono text-xs text-accent">{f.period}</p>
              </div>
              <p className="mt-1 text-sm text-muted">{f.org}</p>
              <p className="mt-2 text-sm leading-relaxed text-faint">{f.note}</p>
            </li>
          ))}
        </ol>

        <div className="flex h-fit flex-col gap-5 rounded-xl border border-line bg-ink-2/60 p-6">
          <Photo />
          <div>
            <h3 className="font-mono text-sm font-medium tracking-wide text-accent">Full CV</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Complete CV with research details, coursework, and project write-ups.
            </p>
            <a
              href={cvHref}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-accent/85"
            >
              View / Download PDF
            </a>
            <p className="mt-2 font-mono text-[10px] text-faint">
              drop the file at public/{profile.cvPath}
            </p>
          </div>
          <div className="border-t border-line pt-4">
            <h4 className="font-mono text-xs tracking-widest text-faint uppercase">Languages</h4>
            <ul className="mt-3 flex flex-col gap-1.5">
              {profile.languages.map((l) => (
                <li key={l.name} className="flex justify-between text-sm">
                  <span className="text-fg/85">{l.name}</span>
                  <span className="font-mono text-xs text-muted">{l.level}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  )
}
