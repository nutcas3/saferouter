// Analytics utility for tracking user interactions
// Supports Google Analytics, PostHog, or custom analytics

interface AnalyticsEvent {
  category: string
  action: string
  label?: string
  value?: number
}

class Analytics {
  private enabled: boolean
  private gaId?: string
  private posthogKey?: string

  constructor() {
    this.enabled = import.meta.env.VITE_ENV === 'production'
    this.gaId = import.meta.env.VITE_GA_TRACKING_ID
    this.posthogKey = import.meta.env.VITE_POSTHOG_KEY
  }

  // Track page views
  pageView(path: string) {
    if (!this.enabled) return

    if (this.gaId && typeof window.gtag !== 'undefined') {
      window.gtag('config', this.gaId, {
        page_path: path,
      })
    }
  }

  // Track custom events
  event({ category, action, label, value }: AnalyticsEvent) {
    if (!this.enabled) return

    if (this.gaId && typeof window.gtag !== 'undefined') {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      })
    }

    // PostHog integration
    if (this.posthogKey && typeof window.posthog !== 'undefined') {
      window.posthog.capture(action, {
        category,
        label,
        value,
      })
    }
  }

  // Track button clicks
  trackButtonClick(buttonName: string, location: string) {
    this.event({
      category: 'Button',
      action: 'Click',
      label: `${buttonName} - ${location}`,
    })
  }

  // Track demo usage
  trackDemoUsage(action: 'anonymize' | 'reset') {
    this.event({
      category: 'Demo',
      action: action === 'anonymize' ? 'Anonymize PII' : 'Reset Demo',
    })
  }

  // Track CTA interactions
  trackCTA(ctaType: 'primary' | 'secondary', location: string) {
    this.event({
      category: 'CTA',
      action: 'Click',
      label: `${ctaType} - ${location}`,
    })
  }
}

export const analytics = new Analytics()

// Type declarations for global analytics
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    posthog?: {
      capture: (event: string, properties?: Record<string, any>) => void
    }
  }
}
