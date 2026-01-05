import { Card, CardContent } from './ui/card'

const testimonials = [
  {
    quote: "SafeRoute gave us the confidence to use LLMs in our healthcare application. The zero-knowledge architecture means we never expose patient data.",
    author: "Dr. Sarah Chen",
    role: "CTO, HealthTech Startup",
    avatar: "👩‍⚕️"
  },
  {
    quote: "Sub-20ms latency overhead is incredible. Our users don't even notice the privacy layer, but we sleep better at night knowing PII is protected.",
    author: "Marcus Johnson",
    role: "Engineering Lead, FinTech",
    avatar: "👨‍💼"
  },
  {
    quote: "HIPAA compliance out of the box. SafeRoute handles all the complexity so we can focus on building features instead of security infrastructure.",
    author: "Emily Rodriguez",
    role: "Head of Security, MedicalAI",
    avatar: "👩‍💻"
  }
]

export function Testimonials() {
  return (
    <div className="py-24 bg-slate-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Loved by Developers & Security Teams
          </h2>
          <p className="text-xl text-slate-400">
            See what teams are saying about SafeRoute
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-slate-800/30 border-slate-700/50">
              <CardContent className="pt-6">
                <div className="text-4xl mb-4">{testimonial.avatar}</div>
                <p className="text-slate-300 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="text-white font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-slate-400">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
