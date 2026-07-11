import { useMemo } from 'react'
import katex from 'katex'

function Tex({ tex }: { tex: string }) {
  const html = useMemo(() => katex.renderToString(tex, { throwOnError: false }), [tex])
  return <span className="katex-accent" dangerouslySetInnerHTML={{ __html: html }} />
}

function Node({
  color,
  title,
  sub,
  filled = false,
}: {
  color: string
  title: React.ReactNode
  sub?: React.ReactNode
  filled?: boolean
}) {
  return (
    <div
      className="w-full rounded-md border px-3 py-2 text-center"
      style={{
        borderColor: color,
        background: filled ? `color-mix(in srgb, ${color} 18%, transparent)` : `color-mix(in srgb, ${color} 7%, transparent)`,
      }}
    >
      <p className="font-mono text-[11.5px] font-medium" style={{ color }}>
        {title}
      </p>
      {sub && <p className="mt-0.5 text-[11px] leading-snug text-muted">{sub}</p>}
    </div>
  )
}

function Arrow() {
  return (
    <svg width="12" height="16" viewBox="0 0 12 16" className="my-0.5 shrink-0 text-faint" aria-hidden>
      <path d="M6 0v11M2 9l4 5 4-5" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

const C = {
  amber: 'var(--color-amber)',
  cyan: 'var(--color-accent)',
  violet: 'var(--color-violet)',
  green: 'var(--color-green)',
  rose: 'var(--color-rose)',
}

/** The GLAS pipeline as a software-architecture flow diagram. */
export default function GlasAlgorithm() {
  return (
    <div className="rounded-lg border border-line bg-ink-2 p-5">
      <div className="flex flex-col items-center">
        <Node color={C.amber} title={<>process spec · <Tex tex="g g \to t\bar{t}" /></>} />
        <Arrow />
        <Node color={C.violet} title="QGRAF" sub="automated diagram generation (0ℓ, 1ℓ)" />
        <Arrow />
        <Node color={C.cyan} title="FORM" sub="Feynman rules · Dirac & colour algebra · traces" />
        <Arrow />
        <div className="grid w-full grid-cols-2 gap-2">
          <Node color={C.green} title={<Tex tex="\textstyle\sum_{s,c}|\mathcal{M}_0|^2" />} sub="LO contraction" />
          <Node color={C.rose} title={<Tex tex="\textstyle\Re(\mathcal{M}_0^{*}\mathcal{M}_1)" />} sub="NLO interference" />
        </div>
        <Arrow />
        <Node color={C.amber} title="UV renormalisation · topology mapping" sub="counterterms · denominator ordering" />
        <Arrow />
        <Node color={C.violet} title="IBP reduction" sub={<>master integrals <Tex tex="\{I_k\}" /> via Blade</>} />
        <Arrow />
        <Node color={C.cyan} title="FiniteFlow" sub="finite-field coefficient reconstruction + partial fractions" />
        <Arrow />
        <Node
          color={C.green}
          filled
          title={<>analytic <Tex tex="|\mathcal{M}|^2" /></>}
          sub="validated against MadGraph5_aMC@NLO"
        />
      </div>
    </div>
  )
}
