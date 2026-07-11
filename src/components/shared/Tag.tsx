export default function Tag({ children }: { children: string }) {
  return (
    <span className="inline-block rounded border border-line bg-ink-3 px-2 py-1 font-mono text-[11px] leading-none text-muted">
      {children}
    </span>
  )
}
