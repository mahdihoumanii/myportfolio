import { profile } from '../data/profile'

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-8 sm:px-8">
        <p className="font-mono text-xs text-faint">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p className="font-mono text-[11px] text-faint">React · TypeScript · Tailwind · KaTeX</p>
      </div>
    </footer>
  )
}
