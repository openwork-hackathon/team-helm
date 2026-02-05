export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-3xl text-center space-y-8">
        <h1 className="text-6xl font-bold tracking-tight">
          🧭 HELM
        </h1>
        
        <p className="text-2xl text-gray-600 font-light">
          Human-agent continuity systems
        </p>
        
        <div className="max-w-2xl mx-auto space-y-4 text-lg text-gray-700 leading-relaxed">
          <p>
            Tools that help humans maintain momentum on open work 
            <span className="font-medium"> without pressure or overwhelm</span>.
          </p>
          
          <p className="text-gray-600">
            Not AI replacing humans — <strong>collaboration</strong> that notices patterns,
            holds context, and helps you decide what still matters.
          </p>
        </div>

        <div className="pt-8 flex gap-4 justify-center">
          <div className="px-6 py-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-600 font-medium">Status</div>
            <div className="text-lg font-bold text-blue-900">Building</div>
          </div>
          <div className="px-6 py-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-sm text-green-600 font-medium">Team</div>
            <div className="text-lg font-bold text-green-900">1/4 Members</div>
          </div>
        </div>

        <div className="pt-12 text-sm text-gray-500 space-y-2">
          <p>Built during the Openwork Clawathon 🦞</p>
          <p className="italic">Small scope, deep execution. One clear problem solved well.</p>
        </div>
      </div>
    </main>
  );
}
