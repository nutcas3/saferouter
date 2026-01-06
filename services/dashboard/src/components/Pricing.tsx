import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Open Source',
    price: 'Free',
    description: 'Self-hosted solution for developers',
    features: [
      'Unlimited requests',
      'All core features',
      'Community support',
      'Docker & Kubernetes configs',
      'MIT License',
      'Self-hosted deployment'
    ],
    cta: 'Get Started',
    highlighted: false
  },
  {
    name: 'Cloud Starter',
    price: '$99',
    period: '/month',
    description: 'Managed cloud service for small teams',
    features: [
      'Up to 1M requests/month',
      'All core features',
      'Email support',
      'Automatic updates',
      '99.9% uptime SLA',
      'Managed infrastructure'
    ],
    cta: 'Start Free Trial',
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large-scale deployments',
    features: [
      'Unlimited requests',
      'Dedicated support',
      'Custom SLA',
      'On-premise deployment',
      'Advanced analytics',
      'Custom integrations'
    ],
    cta: 'Contact Sales',
    highlighted: false
  }
]

export function Pricing() {
  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black-rock mb-4">
            Flexible Pricing for Every Team
          </h2>
          <p className="text-xl text-slate-shadow max-w-2xl mx-auto">
            Start with open source, scale with managed cloud, or go enterprise
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`${
                plan.highlighted 
                  ? 'bg-white border-klaxosaur-blue shadow-lg' 
                  : 'bg-white border-blue-silk'
              }`}
            >
              <CardHeader>
                <CardTitle className="text-2xl text-black-rock">{plan.name}</CardTitle>
                <CardDescription className="text-western-pursuit">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-black-rock">{plan.price}</span>
                  {plan.period && <span className="text-slate-shadow">{plan.period}</span>}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-klaxosaur-blue flex-shrink-0 mt-0.5" strokeWidth={2} />
                      <span className="text-slate-shadow text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${
                    plan.highlighted
                      ? 'bg-retro-nectarine text-white'
                      : 'bg-klaxosaur-blue text-white'
                  } font-semibold`}
                  onClick={() => {
                    if (plan.name === 'Open Source') {
                      window.open('https://github.com/saferoute/saferoute', '_blank')
                    } else if (plan.name === 'Enterprise') {
                      window.location.href = 'mailto:sales@saferoute.io'
                    } else {
                      window.location.href = '/signup'
                    }
                  }}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-shadow">
            All plans include core privacy features. Enterprise plans get custom SLAs and dedicated support.
          </p>
        </div>
      </div>
    </div>
  )
}
