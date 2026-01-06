import { Hero } from './components/Hero'
import { Features } from './components/Features'
import { Stats } from './components/Stats'
import { Demo } from './components/Demo'
import { Pricing } from './components/Pricing'
import { Testimonials } from './components/Testimonials'
import { CTA } from './components/CTA'
import { Footer } from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-voodoo">
      <Hero />
      <Features />
      <Stats />
      <Demo />
      <Pricing />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  )
}

export default App
