import { Hero } from './components/Hero'
import { Features } from './components/Features'
import { Stats } from './components/Stats'
import { Demo } from './components/Demo'
import { Testimonials } from './components/Testimonials'
import { CTA } from './components/CTA'
import { Footer } from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-iron via-slate-exp to-indigo-iron" style={{ backgroundColor: '#393f4d' }}>
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
