import { useState } from 'react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

const exampleText = `Patient John Doe (SSN: 123-45-6789) visited on 12/15/2024. 
Contact: john.doe@email.com or 555-123-4567.
MRN: 1234567890, Credit Card: 4532-1234-5678-9010.`

export function Demo() {
  const [inputText, setInputText] = useState(exampleText)
  const [anonymizedText, setAnonymizedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [detectedCount, setDetectedCount] = useState(0)

  const handleAnonymize = async () => {
    setLoading(true)
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
      const response = await fetch(`${apiUrl}/v1/anonymize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setAnonymizedText(data.anonymized_text)
        setDetectedCount(data.entities_count)
      } else {
        setAnonymizedText('Error: Could not connect to SafeRoute API. Make sure services are running.')
      }
    } catch (error) {
      setAnonymizedText('Error: Could not connect to SafeRoute API. Make sure services are running.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setInputText(exampleText)
    setAnonymizedText('')
    setDetectedCount(0)
  }

  return (
    <div id="demo" className="py-24 bg-slate-950/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Try It Live
          </h2>
          <p className="text-xl text-black">
            See how SafeRoute detects and anonymizes PII in real-time
          </p>
        </div>

        <Card className="bg-kyuri-green/40 border-dirty-green/50">
          <CardHeader>
            <CardTitle className="text-white">Interactive Demo</CardTitle>
            <CardDescription className="text-green-gecko">
              Enter text with PII or use the example below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Original Text (with PII)
              </label>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={6}
                className="bg-darkest-forest/60 border-dirty-green text-white placeholder:text-green-gecko/60"
                placeholder="Enter text containing PII..."
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleAnonymize}
                disabled={loading || !inputText}
                className="bg-macaw-green hover:bg-dirty-green text-white font-semibold"
              >
                {loading ? 'Processing...' : 'Anonymize PII'}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="border-green-gecko text-black hover:bg-macaw-green/20 font-medium"
              >
                Reset
              </Button>
            </div>

            {anonymizedText && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-black">
                    Anonymized Output
                  </label>
                  {detectedCount > 0 && (
                    <span className="text-sm text-green-gecko font-medium">
                      ✓ Detected {detectedCount} PII entities
                    </span>
                  )}
                </div>
                <Textarea
                  value={anonymizedText}
                  readOnly
                  rows={6}
                  className="bg-darkest-forest/60 border-macaw-green/60 text-green-gecko font-mono"
                />
              </div>
            )}

            <div className="bg-darkest-forest/60 rounded-lg p-4 border border-dirty-green/50">
              <h4 className="text-sm font-semibold text-white mb-2">Detected PII Types:</h4>
              <div className="flex flex-wrap gap-2">
                {['SSN', 'Email', 'Phone', 'Name', 'Credit Card', 'Date', 'MRN'].map((type) => (
                  <span
                    key={type}
                    className="px-3 py-1 bg-macaw-green/30 border border-green-gecko/40 rounded-full text-xs text-black font-medium"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="bg-kyuri-green/40 border-dirty-green/50">
            <CardHeader>
              <CardTitle className="text-lg text-black">1. Detect</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-gecko">
                NER service scans text for PII patterns using JAX-powered regex
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-kyuri-green/40 border-dirty-green/50">
            <CardHeader>
              <CardTitle className="text-lg text-black">2. Encrypt</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-gecko">
                Vault stores encrypted entities with AES-256-GCM, 60s TTL
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-kyuri-green/40 border-dirty-green/50">
            <CardHeader>
              <CardTitle className="text-lg text-black">3. Restore</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-gecko">
                Original PII restored in LLM response, then auto-purged
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
