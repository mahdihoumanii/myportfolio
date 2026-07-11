interface Particle {
  symbol: string
  name: string
  kind: 'quark' | 'lepton' | 'gauge' | 'higgs'
  focus?: boolean
}

// canonical layout: three fermion generations + gauge bosons + Higgs
const grid: (Particle | null)[][] = [
  [
    { symbol: 'u', name: 'up', kind: 'quark' },
    { symbol: 'c', name: 'charm', kind: 'quark' },
    { symbol: 't', name: 'top', kind: 'quark', focus: true },
    { symbol: 'g', name: 'gluon', kind: 'gauge' },
    { symbol: 'H', name: 'Higgs', kind: 'higgs' },
  ],
  [
    { symbol: 'd', name: 'down', kind: 'quark' },
    { symbol: 's', name: 'strange', kind: 'quark' },
    { symbol: 'b', name: 'bottom', kind: 'quark' },
    { symbol: 'γ', name: 'photon', kind: 'gauge' },
    null,
  ],
  [
    { symbol: 'e', name: 'electron', kind: 'lepton' },
    { symbol: 'μ', name: 'muon', kind: 'lepton' },
    { symbol: 'τ', name: 'tau', kind: 'lepton' },
    { symbol: 'Z', name: 'Z boson', kind: 'gauge' },
    null,
  ],
  [
    { symbol: 'νe', name: 'e neutrino', kind: 'lepton' },
    { symbol: 'νμ', name: 'μ neutrino', kind: 'lepton' },
    { symbol: 'ντ', name: 'τ neutrino', kind: 'lepton' },
    { symbol: 'W', name: 'W boson', kind: 'gauge' },
    null,
  ],
]

const kindColor: Record<Particle['kind'], string> = {
  quark: 'var(--color-violet)',
  lepton: 'var(--color-green)',
  gauge: 'var(--color-red)',
  higgs: 'var(--color-accent)',
}

/** The Standard Model particle chart, restyled for the dark theme. */
export default function StandardModel() {
  return (
    <div className="rounded-lg border border-line bg-ink-2 p-4">
      <div className="grid grid-cols-5 gap-1.5">
        {grid.flat().map((p, i) =>
          p ? (
            <div
              key={p.symbol}
              className="relative flex flex-col items-center justify-center rounded-md border py-2 sm:aspect-square sm:py-0"
              style={{
                borderColor: p.focus ? 'var(--color-cyan)' : `color-mix(in srgb, ${kindColor[p.kind]} 55%, transparent)`,
                background: `color-mix(in srgb, ${kindColor[p.kind]} ${p.focus ? 16 : 8}%, transparent)`,
                boxShadow: p.focus ? '0 0 14px color-mix(in srgb, var(--color-cyan) 45%, transparent)' : undefined,
              }}
              title={p.name}
            >
              <span className="font-serif text-sm font-semibold italic sm:text-xl" style={{ color: kindColor[p.kind] }}>
                {p.symbol}
              </span>
              <span className="mt-0.5 hidden text-[8.5px] leading-none text-faint sm:block">{p.name}</span>
            </div>
          ) : (
            <div key={`empty-${i}`} />
          ),
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
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
        </div>
        <p className="font-mono text-[10px] text-cyan">t — my corner of it</p>
      </div>
    </div>
  )
}
