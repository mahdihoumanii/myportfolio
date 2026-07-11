import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

interface Particle {
  symbol: string
  name: string
  kind: 'quark' | 'lepton' | 'gauge' | 'higgs'
  mass: string
  charge: string
  spin: string
  /** one-line personality */
  quip: string
  /** short character bio — witty but physically accurate */
  story: string
  focus?: boolean
}

const particles: (Particle | null)[] = [
  {
    symbol: 'u', name: 'up quark', kind: 'quark', mass: '≈ 2.2 MeV', charge: '+2/3', spin: '1/2',
    quip: 'The everyman.',
    story: 'Two of these live in every proton, and they have been doing the same job without complaint for 13.8 billion years. Not glamorous — just literally half of everything you have ever touched.',
  },
  {
    symbol: 'c', name: 'charm quark', kind: 'quark', mass: '≈ 1.27 GeV', charge: '+2/3', spin: '1/2',
    quip: 'Named in a fit of optimism.',
    story: 'Predicted before it was found, then discovered twice in the same month by two rival labs (the “November Revolution”, 1974). Has been coasting on that drama ever since.',
  },
  {
    symbol: 't', name: 'top quark', kind: 'quark', mass: '≈ 173 GeV', charge: '+2/3', spin: '1/2', focus: true,
    quip: 'My favourite — and the reason this website exists.',
    story: 'Heavier than an entire gold atom, yet it decays in 5×10⁻²⁵ seconds — too fast to ever form a hadron. The only quark that lives and dies free. Its mass sits suspiciously close to the electroweak scale, whispering that it knows something about the Higgs the others don’t. I compute its production for a living.',
  },
  {
    symbol: 'g', name: 'gluon', kind: 'gauge', mass: '0', charge: '0', spin: '1',
    quip: 'The glue that talks to itself.',
    story: 'Carries the strong force — but unlike the photon, it also carries colour charge, so gluons interact with other gluons. That single fact is why QCD is hard, why quarks are confined, and why I have a job.',
  },
  {
    symbol: 'H', name: 'Higgs boson', kind: 'higgs', mass: '≈ 125 GeV', charge: '0', spin: '0',
    quip: 'The reason anything weighs anything.',
    story: 'Its field fills the vacuum like syrup, and every massive particle is just wading through it. Proposed in 1964, found in 2012, and the top quark is its closest confidant — they have the strongest coupling in the Standard Model.',
  },
  {
    symbol: 'd', name: 'down quark', kind: 'quark', mass: '≈ 4.7 MeV', charge: '−1/3', spin: '1/2',
    quip: 'The slightly heavier sibling.',
    story: 'One per proton, two per neutron. The tiny mass gap between down and up is why the neutron outweighs the proton — and therefore why hydrogen is stable and chemistry exists. Small differences, cosmic consequences.',
  },
  {
    symbol: 's', name: 'strange quark', kind: 'quark', mass: '≈ 95 MeV', charge: '−1/3', spin: '1/2',
    quip: 'Guilty of suspicious longevity.',
    story: 'Named because kaons lived thousands of times longer than they had any right to. The explanation — a new quantum number called “strangeness” — sounds made up, and in 1953 everyone agreed it was. It wasn’t.',
  },
  {
    symbol: 'b', name: 'bottom quark', kind: 'quark', mass: '≈ 4.18 GeV', charge: '−1/3', spin: '1/2',
    quip: 'Flavour physics’ reliable narrator.',
    story: 'Lives long enough to travel a measurable distance before decaying, which makes it the perfect witness. Entire experiments (and the Cluster of Excellence funding my PhD — “Color Meets Flavour”) are built around interrogating it.',
  },
  {
    symbol: 'γ', name: 'photon', kind: 'gauge', mass: '0', charge: '0', spin: '1',
    quip: 'The only particle you have ever actually seen.',
    story: 'Massless, timeless — from its own point of view, emission and absorption are the same instant. Every photon in this page’s brass palette travelled from your screen to your retina just to deliver one bit of this sentence.',
  },
  {
    symbol: 'e', name: 'electron', kind: 'lepton', mass: '0.511 MeV', charge: '−1', spin: '1/2',
    quip: 'Immortal, and mildly overworked.',
    story: 'The only charged lepton that never decays. All of chemistry, electronics, and this website are side effects of its restlessness. Discovered in 1897 and has not taken a day off since.',
  },
  {
    symbol: 'μ', name: 'muon', kind: 'lepton', mass: '105.7 MeV', charge: '−1', spin: '1/2',
    quip: '“Who ordered that?”',
    story: 'A heavier electron with no apparent purpose — Rabi’s famous complaint still stands. Lives 2.2 microseconds, yet thanks to relativity, muons born in cosmic-ray showers survive to reach your hand. About one passes through it every second.',
  },
  {
    symbol: 'τ', name: 'tau', kind: 'lepton', mass: '1.777 GeV', charge: '−1', spin: '1/2',
    quip: 'The lepton that thinks it’s a hadron.',
    story: 'So heavy it can decay into actual hadrons — the only lepton with that party trick. Blink and you miss it: 3×10⁻¹³ seconds, no encore.',
  },
  {
    symbol: 'Z', name: 'Z boson', kind: 'gauge', mass: '91.2 GeV', charge: '0', spin: '1',
    quip: 'Precision physics’ favourite heavyweight.',
    story: 'Mediates the neutral weak current — it can scatter a neutrino without changing anyone’s identity. Measured so precisely at LEP that its lineshape told us there are exactly three light neutrinos. Case closed.',
  },
  {
    symbol: 'νe', name: 'electron neutrino', kind: 'lepton', mass: '< 1 eV', charge: '0', spin: '1/2',
    quip: 'The sun’s most prolific export.',
    story: 'About 65 billion of them cross every square centimetre of you, every second, straight from the solar core. You will almost certainly never stop a single one in your lifetime. They’re not shy — you’re just transparent.',
  },
  {
    symbol: 'νμ', name: 'muon neutrino', kind: 'lepton', mass: '< 1 eV', charge: '0', spin: '1/2',
    quip: 'Proof that ghosts come in flavours.',
    story: 'Its discovery in 1962 earned a Nobel Prize for showing neutrinos keep families. Then it turned out they swap families mid-flight — oscillations, another Nobel, and the first crack in the Standard Model’s armour.',
  },
  {
    symbol: 'ντ', name: 'tau neutrino', kind: 'lepton', mass: '< 1 eV', charge: '0', spin: '1/2',
    quip: 'The last fermion anyone met.',
    story: 'So elusive it was only directly observed in 2000 — the Standard Model’s final fermion to show its face. Even by neutrino standards, it does not answer emails.',
  },
  {
    symbol: 'W', name: 'W boson', kind: 'gauge', mass: '80.4 GeV', charge: '±1', spin: '1',
    quip: 'The only one that changes flavour.',
    story: 'Every beta decay, every fusion step lighting the sun, every top quark’s death — all of it goes through the W. The universe’s only licensed identity broker.',
  },
]

// canonical chart order: generations × rows, bosons on the right
const gridOrder = ['u', 'c', 't', 'g', 'H', 'd', 's', 'b', 'γ', null, 'e', 'μ', 'τ', 'Z', null, 'νe', 'νμ', 'ντ', 'W', null]

const kindColor: Record<Particle['kind'], string> = {
  quark: 'var(--color-violet)',
  lepton: 'var(--color-green)',
  gauge: 'var(--color-red)',
  higgs: 'var(--color-accent)',
}

const kindLabel: Record<Particle['kind'], string> = {
  quark: 'quark',
  lepton: 'lepton',
  gauge: 'gauge boson',
  higgs: 'scalar boson',
}

/** The Standard Model chart, restyled — every particle has a character. */
export default function StandardModel() {
  const reduce = useReducedMotion()
  const [selectedSym, setSelectedSym] = useState('t')
  const selected = particles.find((p) => p?.symbol === selectedSym) ?? particles[2]!

  return (
    <div className="rounded-sm border border-line bg-ink-2 p-4">
      <p className="mb-3 font-mono text-[10px] tracking-wider text-faint uppercase">
        the cast — press a particle
      </p>
      <div className="grid grid-cols-5 gap-1.5">
        {gridOrder.map((sym, i) => {
          if (!sym) return <div key={`empty-${i}`} />
          const p = particles.find((q) => q?.symbol === sym)!
          const active = sym === selectedSym
          const color = kindColor[p.kind]
          return (
            <motion.button
              key={sym}
              type="button"
              onClick={() => setSelectedSym(sym)}
              whileHover={reduce ? undefined : { y: -2 }}
              whileTap={reduce ? undefined : { scale: 0.94 }}
              aria-pressed={active}
              aria-label={p.name}
              title={p.name}
              className="relative flex cursor-pointer flex-col items-center justify-center rounded-md border py-2 outline-none sm:aspect-square sm:py-0"
              style={{
                borderColor: active ? color : `color-mix(in srgb, ${color} ${p.focus ? 70 : 45}%, transparent)`,
                background: `color-mix(in srgb, ${color} ${active ? 18 : 7}%, transparent)`,
                boxShadow: active ? `0 0 16px color-mix(in srgb, ${color} 40%, transparent)` : undefined,
              }}
            >
              <span className="font-serif text-sm font-semibold italic sm:text-xl" style={{ color }}>
                {p.symbol}
              </span>
              <span className="mt-0.5 hidden text-[8.5px] leading-none text-faint sm:block">{p.name.split(' ')[0]}</span>
              {p.focus && (
                <span
                  aria-hidden
                  className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full"
                  style={{ background: 'var(--color-cyan)' }}
                />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* character card */}
      <div className="mt-4 min-h-[9.5rem] border-t border-line pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.symbol}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
          >
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h4 className="font-serif text-lg font-semibold text-fg">
                <span className="italic" style={{ color: kindColor[selected.kind] }}>
                  {selected.symbol}
                </span>{' '}
                · {selected.name}
              </h4>
              <span className="font-mono text-[10px] tracking-wider text-faint uppercase">{kindLabel[selected.kind]}</span>
            </div>
            <p className="mt-1.5 font-serif text-[15px] text-accent italic">{selected.quip}</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{selected.story}</p>
            <p className="mt-2.5 font-mono text-[10px] text-faint">
              mass {selected.mass} · charge {selected.charge} · spin {selected.spin}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 border-t border-line pt-3">
        {(
          [
            ['quark', 'quarks'],
            ['lepton', 'leptons'],
            ['gauge', 'gauge bosons'],
            ['higgs', 'Higgs'],
          ] as const
        ).map(([kind, label]) => (
          <span key={kind} className="flex items-center gap-1.5 font-mono text-[10px] text-faint">
            <span className="h-2 w-2 rounded-sm" style={{ background: kindColor[kind] }} />
            {label}
          </span>
        ))}
        <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-cyan">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--color-cyan)' }} />
          my corner
        </span>
      </div>
    </div>
  )
}
