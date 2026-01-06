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
    <div className="py-24" style={{ backgroundColor: 'rgba(146, 113, 184, 0.08)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-voodoo mb-4">
            Loved by Developers & Security Teams
          </h2>
          <p className="text-xl text-voodoo" style={{ opacity: 0.8 }}>
            See what teams are saying about SafeRoute
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white border-cookie-dough">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-royal-lilac/20 flex items-center justify-center mb-4">
                  <User className="w-6 h-6 text-royal-lilac" strokeWidth={1.5} />
                </div>
                <p className="text-voodoo mb-6 italic" style={{ opacity: 0.8 }}>
                  <span className="text-cookie-dough text-2xl">"</span>
                  {testimonial.quote}
                  <span className="text-cookie-dough text-2xl">"</span>
                </p>
                <div>
                  <p className="text-voodoo font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-voodoo" style={{ opacity: 0.6 }}>{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
