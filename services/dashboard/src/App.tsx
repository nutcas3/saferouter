import { Hero } from './components/Hero'
import { Features } from './components/Features'
import { Stats } from './components/Stats'
import { Demo } from './components/Demo'
import { Testimonials } from './components/Testimonials'
import { CTA } from './components/CTA'
import { Footer } from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <Hero />
      <Features />
      <Stats />
      <Demo />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  )
}

export default App
