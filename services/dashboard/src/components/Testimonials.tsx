import { Card, CardContent } from './ui/card'
import { User } from 'lucide-react'

const testimonials = [
  {
    quote: "SafeRoute gave us the confidence to use LLMs in our healthcare application. The zero-knowledge architecture means we never expose patient data.",
    author: "Dr. Sarah Chen",
    role: "CTO, HealthTech Startup"
  },
  {
    quote: "Sub-20ms latency overhead is incredible. Our users don't even notice the privacy layer, but we sleep better at night knowing PII is protected.",
    author: "Marcus Johnson",
    role: "Engineering Lead, FinTech"
  },
  {
    quote: "HIPAA compliance out of the box. SafeRoute handles all the complexity so we can focus on building features instead of security infrastructure.",
    author: "Emily Rodriguez",
    role: "Head of Security, MedicalAI"
  }
]

export function Testimonials() {
  return (
    <div className="py-24" style={{ backgroundColor: 'rgba(197, 163, 147, 0.1)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black-rock mb-4">
            Loved by Developers & Security Teams
          </h2>
          <p className="text-xl text-slate-shadow">
            See what teams are saying about SafeRoute
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white border-blue-silk">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-klaxosaur-blue/20 flex items-center justify-center mb-4">
                  <User className="w-6 h-6 text-klaxosaur-blue" strokeWidth={1.5} />
                </div>
                <p className="text-western-pursuit mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="text-black-rock font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-western-pursuit">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
