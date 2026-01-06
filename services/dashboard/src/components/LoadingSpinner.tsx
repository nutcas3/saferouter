export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-voodoo flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-16 h-16 border-4 border-viola border-t-elysium-gold rounded-full animate-spin mb-4"></div>
        <p className="text-night-white text-lg">Loading SafeRoute...</p>
      </div>
    </div>
  )
}
