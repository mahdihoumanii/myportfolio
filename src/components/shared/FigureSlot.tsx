import { useState } from 'react'
import type { ProjectFigure } from '../../data/projects'

/**
 * Renders a project figure if the file exists under public/, otherwise a
 * styled placeholder printing the exact path to drop the asset at.
 */
export default function FigureSlot({ figure }: { figure: ProjectFigure }) {
  const [failed, setFailed] = useState(false)
  const src = `${import.meta.env.BASE_URL}${figure.src}`

  if (failed) {
    return (
      <div className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-line bg-ink-2 p-6 text-center">
        <svg className="h-8 w-8 text-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 15l5-5 4 4 3-3 6 6" />
          <circle cx="9" cy="9" r="1.5" />
        </svg>
        <p className="text-sm text-muted">{figure.caption}</p>
        <p className="font-mono text-[11px] text-faint">
          drop figure at <span className="text-accent">public/{figure.src}</span>
        </p>
      </div>
    )
  }

  return (
    <figure className="overflow-hidden rounded-lg border border-line bg-ink-2">
      <img
        src={src}
        alt={figure.caption}
        loading="lazy"
        onError={() => setFailed(true)}
        className="w-full object-contain"
      />
      <figcaption className="border-t border-line px-4 py-2.5 font-mono text-[11px] text-faint">
        {figure.caption}
      </figcaption>
    </figure>
  )
}
