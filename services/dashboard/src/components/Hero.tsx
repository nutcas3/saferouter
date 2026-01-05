import { Button } from './ui/button'

export function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-32 sm:pb-32">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-hot-coral/10 border border-hot-coral/30 mb-8">
            <div className="w-2 h-2 rounded-full bg-hot-coral animate-pulse" />
            <span className="text-sm text-light-spirit">Zero-knowledge privacy for LLMs</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-ethereal mb-6">
            Protect PII Before It
            <br />
            <span className="bg-gradient-to-r from-hot-coral via-light-spirit to-hot-coral bg-clip-text text-transparent">
              Reaches Your LLM
            </span>
          </h1>
          
          <p className="text-xl text-scribe max-w-2xl mx-auto mb-10">
            Enterprise-grade privacy middleware that strips sensitive data before sending to LLMs 
            and restores it on the way back. HIPAA & GDPR compliant.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-hot-coral hover:bg-hot-coral/90 text-ethereal px-8 py-6 text-lg"
              onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Try Live Demo
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-scribe text-light-spirit hover:bg-scribe/10 px-8 py-6 text-lg"
              onClick={() => window.open('https://github.com/saferoute/saferoute', '_blank')}
            >
              View on GitHub
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-ethereal mb-1">&lt;20ms</div>
              <div className="text-sm text-scribe">Latency Overhead</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-ethereal mb-1">99.2%</div>
              <div className="text-sm text-scribe">PII Detection</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-ethereal mb-1">50K+</div>
              <div className="text-sm text-scribe">Req/Sec</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-ethereal mb-1">60s</div>
              <div className="text-sm text-scribe">Auto-Purge</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
