import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

export function Stats() {
  return (
    <div className="py-16 bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Trusted by Security-Conscious Teams
          </h2>
          <p className="text-lg text-moon-glow">
            Processing millions of requests while maintaining zero-knowledge privacy
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <Card className="bg-kyuri-green/40 border-dirty-green/50 text-center">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-green-gecko">10M+</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-moon-glow">Requests Processed</p>
            </CardContent>
          </Card>

          <Card className="bg-kyuri-green/40 border-dirty-green/50 text-center">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-green-gecko">99.9%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-moon-glow">Uptime SLA</p>
            </CardContent>
          </Card>

          <Card className="bg-kyuri-green/40 border-dirty-green/50 text-center">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-green-gecko">&lt;15ms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-moon-glow">P95 Latency</p>
            </CardContent>
          </Card>

          <Card className="bg-kyuri-green/40 border-dirty-green/50 text-center">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-green-gecko">0</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-moon-glow">Data Breaches</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
