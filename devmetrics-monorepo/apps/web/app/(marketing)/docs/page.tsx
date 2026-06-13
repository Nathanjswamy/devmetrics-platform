export default function DocsPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-8 py-24 min-h-[60vh]">
      <h1 className="text-4xl font-sans text-text-primary mb-8">Documentation</h1>
      <div className="prose prose-invert max-w-none text-text-secondary">
        <p className="text-xl mb-12">
          Welcome to the DevMetrics documentation. Here you will find guides and reference material to help you get the most out of your engineering intelligence platform.
        </p>
        
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl text-text-primary mb-4 border-b border-border pb-2">Getting Started</h2>
            <ul className="space-y-3 list-disc pl-5">
              <li><a href="#" className="text-[#2B6B6D] hover:underline">Connecting your GitHub Account</a></li>
              <li><a href="#" className="text-[#2B6B6D] hover:underline">Understanding your Developer DNA</a></li>
              <li><a href="#" className="text-[#2B6B6D] hover:underline">Inviting your Team</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-text-primary mb-4 border-b border-border pb-2">Metric Definitions</h2>
            <ul className="space-y-3 list-disc pl-5">
              <li><a href="#" className="text-[#2B6B6D] hover:underline">How DORA Metrics are calculated</a></li>
              <li><a href="#" className="text-[#2B6B6D] hover:underline">Code Review Velocity</a></li>
              <li><a href="#" className="text-[#2B6B6D] hover:underline">Deployment Risk Scoring</a></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
