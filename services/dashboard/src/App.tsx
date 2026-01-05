import { Hero } from './components/Hero'
import { Features } from './components/Features'
import { Demo } from './components/Demo'
import { Footer } from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <Hero />
      <Features />
      <Demo />
      <Footer />
    </div>
  )
}

export default App
