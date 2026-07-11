import { profile } from '../data/profile'

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl items-center px-5 py-8 sm:px-8">
        <p className="font-mono text-xs text-faint">
          © {new Date().getFullYear()} {profile.name}
        </p>
      </div>
    </footer>
  )
}