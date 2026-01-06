import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

export function Stats() {
  return (
    <div className="py-16" style={{ backgroundColor: 'rgba(206, 219, 232, 0.3)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black-rock mb-4">
            Trusted by Security-Conscious Teams
          </h2>
          <p className="text-lg text-slate-shadow">
            Processing millions of requests while maintaining zero-knowledge privacy
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <Card className="bg-white border-blue-silk text-center">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-klaxosaur-blue">10M+</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-western-pursuit">Requests Processed</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-blue-silk text-center">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-klaxosaur-blue">99.9%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-western-pursuit">Uptime SLA</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-blue-silk text-center">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-klaxosaur-blue">&lt;15ms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-western-pursuit">P95 Latency</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-blue-silk text-center">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-klaxosaur-blue">0</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-western-pursuit">Data Breaches</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
