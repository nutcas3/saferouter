import { Button } from './ui/button'

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-voodoo">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-royal-lilac/20 rounded-full blur-3xl" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-royal-lilac/20 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-32 sm:pb-32">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-royal-lilac/20 border border-viola/40 mb-8">
            <div className="w-2 h-2 rounded-full bg-elysium-gold animate-pulse" />
            <span className="text-sm text-night-white font-medium">Zero-knowledge privacy for LLMs</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-night-white mb-6">
            Protect PII Before It
            <br />
            <span className="bg-gradient-to-r from-elysium-gold via-viola to-elysium-gold bg-clip-text text-transparent">
              Reaches Your LLM
            </span>
          </h1>
          
          <p className="text-xl text-night-white max-w-2xl mx-auto mb-10">
            Enterprise-grade privacy middleware that strips sensitive data before sending to LLMs 
            and restores it on the way back. HIPAA & GDPR compliant.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-elysium-gold text-voodoo px-8 py-6 text-lg font-semibold"
              onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Try Live Demo
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-viola text-viola px-8 py-6 text-lg font-medium"
              onClick={() => window.open('https://github.com/saferoute/saferoute', '_blank')}
            >
              View on GitHub
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-elysium-gold mb-2">10ms</div>
              <div className="text-sm text-viola">Avg Latency</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-elysium-gold mb-2">99.9%</div>
              <div className="text-sm text-viola">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-elysium-gold mb-2">AES-256</div>
              <div className="text-sm text-viola">Encryption</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-elysium-gold mb-2">60s</div>
              <div className="text-sm text-viola">Auto-Purge</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
