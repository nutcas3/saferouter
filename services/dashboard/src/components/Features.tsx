import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

const features = [
  {
    title: 'Zero-Knowledge Architecture',
    description: 'Your LLM provider never sees the original PII. Data is tokenized before transmission and restored after.',
    icon: '🔒',
  },
  {
    title: 'Sub-10ms NER Detection',
    description: 'Ultra-fast PII detection using JAX-powered regex patterns. Detects SSN, emails, phone numbers, medical records, and more.',
    icon: '⚡',
  },
  {
    title: 'AES-256-GCM Encryption',
    description: 'Military-grade encryption with per-request unique keys. Data stored in memory only, auto-purged after 60 seconds.',
    icon: '🛡️',
  },
  {
    title: 'HIPAA & GDPR Compliant',
    description: 'Built for healthcare and enterprise. Zero persistent logs, memory-only storage, automatic data purging.',
    icon: '✅',
  },
  {
    title: 'Multi-Domain Support',
    description: 'Specialized patterns for medical (MRN, ICD codes), legal (case numbers, dockets), and general PII detection.',
    icon: '🏥',
  },
  {
    title: 'Production Ready',
    description: 'Docker Compose for dev, Kubernetes for production. Prometheus metrics, Grafana dashboards, horizontal scaling.',
    icon: '🚀',
  },
]

export function Features() {
  return (
    <div className="py-24 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-ethereal mb-4">
            Enterprise-Grade Privacy
          </h2>
          <p className="text-xl text-scribe max-w-2xl mx-auto">
            Built for developers who need to protect sensitive data without sacrificing performance
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-slate-exp/30 border-scribe/50 hover:border-hot-coral/50 transition-all">
              <CardHeader>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardTitle className="text-ethereal">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-light-spirit">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
