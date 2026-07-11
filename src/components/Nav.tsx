import { useEffect, useState } from 'react'

const links = [
  { id: 'journey', label: 'Journey' },
  { id: 'research', label: 'Research' },
  { id: 'physics-projects', label: 'Physics' },
  { id: 'bridge', label: 'Bridge' },
  { id: 'quant-projects', label: 'Quant' },
  { id: 'skills', label: 'Skills' },
  { id: 'cv', label: 'CV' },
  { id: 'contact', label: 'Contact' },
]

export default function Nav() {
  const [active, setActive] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )
    for (const { id } of links) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'border-b border-line bg-ink/85 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="font-mono text-sm font-medium tracking-wide text-fg hover:text-accent">
          M. E. Houmani
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {links.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`text-sm transition-colors ${
                active === id ? 'text-accent' : 'text-muted hover:text-fg'
              }`}
            >
              {label}
            </a>
          ))}
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="text-muted hover:text-fg md:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-b border-line bg-ink/95 backdrop-blur-md md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-3">
            {links.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className={`rounded px-2 py-2 text-sm ${
                  active === id ? 'text-accent' : 'text-muted hover:text-fg'
                }`}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
