import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

export function Stats() {
  return (
    <div className="py-16 bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Trusted by Security-Conscious Teams
          </h2>
          <p className="text-lg text-slate-400">
            Processing millions of requests while maintaining zero-knowledge privacy
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <Card className="bg-slate-800/30 border-slate-700/50 text-center">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-purple-400">10M+</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">Requests Processed</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/30 border-slate-700/50 text-center">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-purple-400">99.9%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">Uptime SLA</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/30 border-slate-700/50 text-center">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-purple-400">&lt;15ms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">P95 Latency</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/30 border-slate-700/50 text-center">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-purple-400">0</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">Data Breaches</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
