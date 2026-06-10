export default function TermsPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-8 py-24 min-h-[60vh]">
      <h1 className="text-4xl font-serif text-text-primary mb-8">Terms of Service</h1>
      <div className="prose prose-invert max-w-none text-text-secondary">
        <p>Effective Date: {new Date().toLocaleDateString()}</p>
        <p className="mt-4">
          Welcome to DevMetrics. By using our services, you agree to these terms. DevMetrics provides engineering intelligence by analyzing your repositories, commits, and pull requests.
        </p>
        <h2 className="text-2xl text-text-primary mt-8 mb-4">1. Acceptance of Terms</h2>
        <p>By accessing or using our platform, you confirm your agreement to be bound by these Terms of Service. If you do not agree to these terms, please do not use DevMetrics.</p>
        
        <h2 className="text-2xl text-text-primary mt-8 mb-4">2. Data Usage</h2>
        <p>We require read-access to your connected source code repositories to generate metrics. We do not store your source code. We only store metadata (commit hashes, timestamps, author names, PR statuses) necessary to generate your Developer DNA.</p>
      </div>
    </div>
  );
}
