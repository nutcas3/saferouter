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
    <div className="py-24 bg-night-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-voodoo mb-4">
            Flexible Pricing for Every Team
          </h2>
          <p className="text-xl text-voodoo max-w-2xl mx-auto" style={{ opacity: 0.8 }}>
            Start with open source, scale with managed cloud, or go enterprise
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`${
                plan.highlighted 
                  ? 'bg-voodoo border-elysium-gold shadow-lg' 
                  : 'bg-white border-royal-lilac'
              }`}
            >
              <CardHeader>
                <CardTitle className={`text-2xl ${
                  plan.highlighted ? 'text-night-white' : 'text-voodoo'
                }`}>{plan.name}</CardTitle>
                <CardDescription className={plan.highlighted ? 'text-viola' : 'text-voodoo'} style={{ opacity: plan.highlighted ? 1 : 0.7 }}>
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <span className={`text-4xl font-bold ${
                    plan.highlighted ? 'text-elysium-gold' : 'text-royal-lilac'
                  }`}>{plan.price}</span>
                  {plan.period && <span className={plan.highlighted ? 'text-viola' : 'text-voodoo'} style={{ opacity: 0.7 }}>{plan.period}</span>}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 ${
                        plan.highlighted ? 'text-elysium-gold' : 'text-royal-lilac'
                      } flex-shrink-0 mt-0.5`} strokeWidth={2} />
                      <span className={`text-sm ${
                        plan.highlighted ? 'text-night-white' : 'text-voodoo'
                      }`} style={{ opacity: plan.highlighted ? 0.9 : 0.7 }}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${
                    plan.highlighted
                      ? 'bg-elysium-gold text-voodoo'
                      : 'bg-royal-lilac text-white'
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
          <p className="text-voodoo" style={{ opacity: 0.7 }}>
            All plans include core privacy features. Enterprise plans get custom SLAs and dedicated support.
          </p>
        </div>
      </div>
    </div>
  )
}
