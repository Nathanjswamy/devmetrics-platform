export default function PrivacyPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-8 py-24 min-h-[60vh]">
      <h1 className="text-4xl font-serif text-text-primary mb-8">Privacy Policy</h1>
      <div className="prose prose-invert max-w-none text-text-secondary">
        <p>Effective Date: {new Date().toLocaleDateString()}</p>
        <p className="mt-4">
          At DevMetrics, we take your privacy seriously. This policy describes what information we collect, how we use it, and your choices regarding your personal data.
        </p>
        
        <h2 className="text-2xl text-text-primary mt-8 mb-4">Information We Collect</h2>
        <p>When you register, we collect your name, email address, and GitHub username. When you connect repositories, we collect metadata about your software development activity.</p>
        
        <h2 className="text-2xl text-text-primary mt-8 mb-4">How We Use Your Data</h2>
        <p>Your data is strictly used to provide the DevMetrics dashboard experience. We do not sell your personal data to third parties.</p>
      </div>
    </div>
  );
}
