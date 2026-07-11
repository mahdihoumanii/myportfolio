import Nav from './components/Nav'
import Hero from './components/Hero'
import Journey from './components/Journey'
import Research from './components/Research'
import PhysicsProjects from './components/PhysicsProjects'
import Bridge from './components/Bridge'
import QuantProjects from './components/QuantProjects'
import Skills from './components/Skills'
import CVSection from './components/CVSection'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-svh bg-ink text-fg">
      <Nav />
      <main>
        <Hero />
        <Journey />
        <Research />
        <PhysicsProjects />
        <Bridge />
        <QuantProjects />
        <Skills />
        <CVSection />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
