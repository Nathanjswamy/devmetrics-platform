import Link from "next/link";
import { ArrowRight, Activity, GitCommit, Shield } from "lucide-react";

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      
      {/* Navigation */}
      <nav className="w-full max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
        <div className="font-serif text-2xl tracking-tight text-text-primary">DevMetrics</div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
            Log in
          </Link>
          <Link href="/dashboard" className="btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="w-full flex-1 flex flex-col items-center text-center px-4 mt-24 mb-32">
        <h1 className="text-5xl md:text-7xl font-serif text-text-primary tracking-tight max-w-4xl mb-6 leading-tight">
          Engineering Intelligence <br /> <span className="text-[#2B6B6D]">For High-Performing Teams</span>
        </h1>
        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mb-10 leading-relaxed">
          Unlock your organization's Developer DNA. Track DORA metrics, eliminate deployment bottlenecks, and supercharge your code review velocity with DevMetrics.
        </p>
        <Link href="/signup" className="btn-primary px-8 py-4 text-base flex items-center gap-2 mb-16 shadow-lg shadow-border-bright/20" style={{ background: "#2B6B6D", color: "#F8F6F1" }}>
          Get Started for Free <ArrowRight size={18} />
        </Link>

        {/* Product Screenshot */}
        <div className="w-full max-w-6xl rounded-xl border border-border bg-surface p-2 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none opacity-20" />
          <img 
            src="/screenshot-dna.png" 
            alt="DevMetrics Developer DNA Dashboard" 
            className="w-full rounded-lg object-cover border border-border/50"
          />
        </div>
      </main>

      {/* Features Section */}
      <section className="w-full border-t border-border bg-surface py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Activity />}
              title="Developer DNA"
              description="A multi-dimensional profile based on Velocity, Code Quality, Review Depth, Consistency, and Focus. See exactly where your engineering strengths lie."
            />
            <FeatureCard 
              icon={<GitCommit />}
              title="Universal Commit Analytics"
              description="Whether you use Pull Requests or push directly to main, we track your impact. See your streak, activity heatmap, and repository health at a glance."
            />
            <FeatureCard 
              icon={<Shield />}
              title="Deployment Risk & Health"
              description="Monitor project health scores and identify high-risk deployments before they happen based on historical metrics and review patterns."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-border py-12 flex flex-col items-center bg-surface">
        <div className="w-full max-w-7xl px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="flex flex-col">
            <div className="font-serif text-xl mb-4 text-text-primary">DevMetrics</div>
            <p className="text-sm text-text-muted">Empowering engineering teams with data.</p>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-text-primary font-bold mb-2">Product</h4>
            <Link href="/login" className="text-sm text-text-secondary hover:text-text-primary">Login</Link>
            <Link href="/signup" className="text-sm text-text-secondary hover:text-text-primary">Sign Up</Link>
            <Link href="/docs" className="text-sm text-text-secondary hover:text-text-primary">Documentation</Link>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-text-primary font-bold mb-2">Legal</h4>
            <Link href="/terms" className="text-sm text-text-secondary hover:text-text-primary">Terms of Service</Link>
            <Link href="/privacy" className="text-sm text-text-secondary hover:text-text-primary">Privacy Policy</Link>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-text-primary font-bold mb-2">Company</h4>
            <Link href="/contact" className="text-sm text-text-secondary hover:text-text-primary">Contact Us</Link>
          </div>
        </div>
        <p className="text-center text-text-muted text-sm pt-8 border-t border-border w-full max-w-7xl">
          © {new Date().getFullYear()} DevMetrics. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-start text-left p-6 rounded-xl border border-border bg-background shadow-sm hover:shadow-md transition-shadow">
      <div className="p-3 bg-surface border border-border rounded-lg text-text-primary mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-text-primary mb-3">{title}</h3>
      <p className="text-text-secondary leading-relaxed">
        {description}
      </p>
    </div>
  );
}
