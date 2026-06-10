export default function ContactPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-8 py-24 min-h-[60vh]">
      <h1 className="text-4xl font-serif text-text-primary mb-8">Contact Us</h1>
      <div className="prose prose-invert max-w-none text-text-secondary">
        <p className="mb-8">
          Have questions about DevMetrics? Our team is here to help. Reach out to us through any of the channels below.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="p-6 border border-border bg-surface rounded-lg">
            <h3 className="text-xl text-text-primary mb-2 font-bold">Sales & Enterprise</h3>
            <p className="mb-4">Interested in deploying DevMetrics for your entire engineering organization?</p>
            <a href="mailto:sales@devmetrics.app" className="text-[#2B6B6D] hover:underline font-medium">sales@devmetrics.app</a>
          </div>
          
          <div className="p-6 border border-border bg-surface rounded-lg">
            <h3 className="text-xl text-text-primary mb-2 font-bold">Technical Support</h3>
            <p className="mb-4">Having trouble syncing a repository or viewing your metrics?</p>
            <a href="mailto:support@devmetrics.app" className="text-[#2B6B6D] hover:underline font-medium">support@devmetrics.app</a>
          </div>
        </div>
      </div>
    </div>
  );
}
