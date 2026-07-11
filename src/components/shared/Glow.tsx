interface GlowProps {
  /** CSS color of the glow, e.g. 'var(--color-amber)' */
  color: string
  /** Positioning/sizing classes, e.g. '-top-40 right-0 h-[480px] w-[480px]' */
  className: string
}

/** A soft radial color glow floated behind a section to keep the dark theme alive. */
export default function Glow({ color, className }: GlowProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, opacity: 0.13 }}
    />
  )
}
