import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

export function Stats() {
  return (
    <div className="py-16 bg-voodoo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-night-white mb-4">
            Trusted by Security-Conscious Teams
          </h2>
          <p className="text-lg text-viola">
            Processing millions of requests while maintaining zero-knowledge privacy
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <Card className="bg-voodoo border-cookie-dough text-center">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-elysium-gold">10M+</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-viola">Requests Processed</p>
            </CardContent>
          </Card>

          <Card className="bg-voodoo border-cookie-dough text-center">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-elysium-gold">99.9%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-viola">Uptime SLA</p>
            </CardContent>
          </Card>

          <Card className="bg-voodoo border-cookie-dough text-center">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-elysium-gold">&lt;15ms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-viola">P95 Latency</p>
            </CardContent>
          </Card>

          <Card className="bg-voodoo border-cookie-dough text-center">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-elysium-gold">0</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-viola">Data Breaches</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
