import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Lock, Zap, Shield, CheckCircle, Building2, Rocket } from 'lucide-react'

const features = [
  {
    title: 'Zero-Knowledge Architecture',
    description: 'Your LLM provider never sees the original PII. Data is tokenized before transmission and restored after.',
    icon: Lock,
  },
  {
    title: 'Sub-10ms NER Detection',
    description: 'Ultra-fast PII detection using JAX-powered regex patterns. Detects SSN, emails, phone numbers, medical records, and more.',
    icon: Zap,
  },
  {
    title: 'AES-256-GCM Encryption',
    description: 'Military-grade encryption with per-request unique keys. Data stored in memory only, auto-purged after 60 seconds.',
    icon: Shield,
  },
  {
    title: 'HIPAA & GDPR Compliant',
    description: 'Built for healthcare and enterprise. Zero persistent logs, memory-only storage, automatic data purging.',
    icon: CheckCircle,
  },
  {
    title: 'Multi-Domain Support',
    description: 'Specialized patterns for medical (MRN, ICD codes), legal (case numbers, dockets), and general PII detection.',
    icon: Building2,
  },
  {
    title: 'Production Ready',
    description: 'Docker Compose for dev, Kubernetes for production. Prometheus metrics, Grafana dashboards, horizontal scaling.',
    icon: Rocket,
  },
]

export function Features() {
  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black-rock mb-4">
            Enterprise-Grade Privacy
          </h2>
          <p className="text-xl text-slate-shadow max-w-2xl mx-auto">
            Built for developers who need to protect sensitive data without sacrificing performance
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="bg-white border-blue-silk">
                <CardHeader>
                  <Icon className="w-10 h-10 mb-4 text-klaxosaur-blue" strokeWidth={1.5} />
                  <CardTitle className="text-black-rock">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-shadow">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
