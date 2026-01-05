import { Button } from './ui/button'

export function CTA() {
  return (
    <div className="py-24 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Ready to Protect Your Users' Privacy?
        </h2>
        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
          Install SafeRoute in under 5 minutes and start protecting PII in your LLM applications today.
        </p>
        
        <div className="bg-slate-900/50 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
          <code className="text-purple-300 text-lg font-mono">
            curl -sL https://get.saferoute.sh | sh
          </code>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-white text-purple-900 hover:bg-slate-100 px-8 py-6 text-lg font-semibold"
            onClick={() => window.open('https://github.com/saferoute/saferoute', '_blank')}
          >
            Get Started Free
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white/50 text-white hover:bg-white/10 px-8 py-6 text-lg"
            onClick={() => window.open('https://docs.saferoute.io', '_blank')}
          >
            Read Documentation
          </Button>
        </div>

        <p className="text-sm text-slate-400 mt-8">
          Open source • MIT License • No credit card required
        </p>
      </div>
    </div>
  )
}
