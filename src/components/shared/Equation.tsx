import { useMemo } from 'react'
import katex from 'katex'
import type { Equation as Eq } from '../../data/equations'

export default function Equation({ eq }: { eq: Eq }) {
  const html = useMemo(
    () => katex.renderToString(eq.tex, { displayMode: true, throwOnError: false }),
    [eq.tex],
  )
  return (
    <div className="katex-accent rounded-lg border border-line bg-ink-2 px-5 py-4">
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <p className="mt-2 font-mono text-[11px] text-faint">{eq.label}</p>
    </div>
  )
}
