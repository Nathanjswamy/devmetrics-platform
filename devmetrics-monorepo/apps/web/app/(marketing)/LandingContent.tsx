"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, GitBranch, BarChart3, Shield, Zap, LineChart, GitPullRequest, Users, Code2, Activity, Layers, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";

const KineticTextReveal = dynamic(
  () => import("../components/KineticTextReveal").then((mod) => mod.KineticTextReveal),
  { ssr: false }
);

const PixelCanvas = dynamic(
  () => import("../components/PixelCanvas").then((mod) => mod.PixelCanvas),
  { ssr: false }
);

export default function LandingContent() {
  return (
    <div className="min-h-screen relative" style={{ background: '#0a0a0a', color: '#e0e0e0' }}>
      
      {/* ═══════════════════════ NAVIGATION ═══════════════════════ */}
      <nav className="w-full max-w-7xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between relative z-50">
        <Link href="/" className="flex items-center gap-2 no-underline group">
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="3" fill="white" />
            <circle cx="28" cy="8" r="3" fill="white" />
            <circle cx="8" cy="20" r="3" fill="white" />
            <circle cx="20" cy="20" r="3" fill="white" />
            <circle cx="32" cy="20" r="3" fill="white" />
            <circle cx="12" cy="32" r="3" fill="white" />
            <circle cx="28" cy="32" r="3" fill="white" />
          </svg>
          <span className="text-sm font-semibold tracking-[0.15em] uppercase" style={{ color: '#e0e0e0' }}>
            DevMetrics
          </span>
        </Link>
        <div className="flex items-center gap-5">
          <Link href="/login" className="text-sm transition-colors hover:text-white" style={{ color: '#888' }}>
            Log in
          </Link>
          <Link 
            href="/signup" 
            className="text-sm font-medium px-5 py-2 rounded-full transition-all duration-200"
            style={{ background: '#fff', color: '#0a0a0a' }}
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="relative w-full overflow-hidden flex flex-col items-center justify-center pt-32 pb-40">
        <div className="absolute inset-0 z-0">
          <PixelCanvas />
          {/* Subtle bottom fade to blend with the rest of the page */}
          <div className="absolute inset-x-0 bottom-0 h-64 pointer-events-none" style={{
            background: 'linear-gradient(to top, #0a0a0a 0%, transparent 100%)'
          }} />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-10 text-center pointer-events-none">
          <p className="text-xs uppercase tracking-[0.25em] mb-8 font-medium pointer-events-auto" style={{ color: '#aaa' }}>
            Engineering Intelligence Platform
          </p>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] tracking-tight mb-8 drop-shadow-2xl" style={{ color: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>
            <KineticTextReveal
              splitBy="words"
              direction="up"
              blur={true}
              stagger={0.08}
              autoPlay={true}
            >
              Home to your product team's performance and productivity
            </KineticTextReveal>
          </h1>
          
          <p className="text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed pointer-events-auto" style={{ color: '#aaa', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
            Transform commits, pull requests, code reviews, and deployments into actionable engineering intelligence. Know your Developer DNA.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto">
            <Link 
              href="/signup" 
              className="inline-flex items-center gap-2 text-sm font-medium px-7 py-3 rounded-full transition-all duration-200 shadow-lg"
              style={{ background: '#fff', color: '#0a0a0a' }}
            >
              Get Started Free <ArrowRight size={16} />
            </Link>
            <Link 
              href="/docs" 
              className="inline-flex items-center gap-2 text-sm font-medium px-7 py-3 rounded-full transition-all duration-200 bg-black/50 backdrop-blur-md"
              style={{ border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
            >
              Documentation <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ TRUSTED BY / LOGOS BAR ═══════════════════════ */}
      <section className="w-full max-w-5xl mx-auto px-6 md:px-10 py-16">
        <div className="flex items-center justify-center gap-10 md:gap-16 flex-wrap opacity-30">
          {["GitHub", "GitLab", "Bitbucket", "Jira", "Linear"].map(name => (
            <span key={name} className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: '#666' }}>
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* ═══════════════════════ SECTION: Made for modern developers ═══════════════════════ */}
      <section className="w-full max-w-6xl mx-auto px-6 md:px-10 py-24">
        <div className="mb-16">
          <p className="text-xs uppercase tracking-[0.25em] mb-4 font-medium" style={{ color: '#555' }}>
            Made for modern
          </p>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight" style={{ color: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>
            <KineticTextReveal
              splitBy="words"
              direction="up"
              blur={true}
              stagger={0.08}
              autoPlay={true}
            >
              developers
            </KineticTextReveal>
          </h2>
        </div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FeatureCard 
            icon={<Activity size={20} />}
            title="Developer DNA"
            description="Multi-dimensional profiles based on velocity, quality, review depth, and consistency."
          />
          <FeatureCard 
            icon={<BarChart3 size={20} />}
            title="DORA Metrics"
            description="Track deployment frequency, lead time, MTTR, and change failure rate automatically."
          />
          <FeatureCard 
            icon={<GitBranch size={20} />}
            title="Commit Analytics"
            description="Whether you use PRs or push to main, we track your impact across every repository."
          />
        </div>

        {/* Integration logos bar */}
        <div className="mt-8 rounded-2xl px-8 py-6 flex items-center justify-between" style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
          <span className="text-xs uppercase tracking-[0.2em] font-medium" style={{ color: '#444' }}>Works with your stack</span>
          <div className="flex items-center gap-8">
            {["GitHub", "GitLab", "Bitbucket"].map(name => (
              <span key={name} className="text-xs font-medium tracking-wider" style={{ color: '#555' }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ SECTION: Set the product direction ═══════════════════════ */}
      <section className="w-full max-w-6xl mx-auto px-6 md:px-10 py-24">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.25em] mb-4 font-medium" style={{ color: '#555' }}>
            Insights that matter
          </p>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight" style={{ color: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>
            <KineticTextReveal
              splitBy="words"
              direction="up"
              blur={true}
              stagger={0.08}
              autoPlay={true}
            >
              Set the product direction
            </KineticTextReveal>
          </h2>
        </div>

        {/* Large product showcase */}
        <div className="rounded-2xl overflow-hidden relative" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-light mb-4" style={{ color: '#fff' }}>
                  Code Review Intelligence
                </h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: '#777' }}>
                  Understand review patterns, identify bottlenecks, and optimize your team's code review process with AI-powered insights. Track review depth, response time, and collaboration quality.
                </p>
                <Link href="/signup" className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-white" style={{ color: '#888' }}>
                  Learn more <ChevronRight size={14} />
                </Link>
              </div>
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                <Image 
                  src="/feature-codereview.png" 
                  alt="Code Review Interface"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Two-column feature cards below */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="rounded-2xl p-8" style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
            <div className="mb-4 p-2.5 rounded-lg inline-flex" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <Shield size={18} style={{ color: '#888' }} />
            </div>
            <h3 className="text-lg font-medium mb-2" style={{ color: '#fff' }}>Deployment Risk Scoring</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#666' }}>
              Monitor project health scores and identify high-risk deployments before they happen based on historical metrics and review patterns.
            </p>
          </div>
          <div className="rounded-2xl p-8" style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
            <div className="mb-4 p-2.5 rounded-lg inline-flex" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <LineChart size={18} style={{ color: '#888' }} />
            </div>
            <h3 className="text-lg font-medium mb-2" style={{ color: '#fff' }}>Trend Analysis</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#666' }}>
              See how your team's performance evolves over time with weekly and monthly trend reports powered by intelligent benchmarking.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ SECTION: Detailed Feature Grid ═══════════════════════ */}
      <section className="w-full max-w-6xl mx-auto px-6 md:px-10 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Large left card */}
          <div className="rounded-2xl p-8 md:p-10 flex flex-col justify-between min-h-[320px]" style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
            <div>
              <div className="mb-4 p-2.5 rounded-lg inline-flex" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <Users size={18} style={{ color: '#888' }} />
              </div>
              <h3 className="text-xl font-medium mb-3" style={{ color: '#fff' }}>Team Leaderboards</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#666' }}>
                Gamify engineering excellence with transparent rankings across velocity, quality, review depth, and consistency. Foster healthy competition and recognize top performers.
              </p>
            </div>
            <Link href="/signup" className="inline-flex items-center gap-2 text-sm font-medium mt-6 transition-colors hover:text-white" style={{ color: '#888' }}>
              Explore <ArrowRight size={14} />
            </Link>
          </div>

          {/* Right column - two stacked cards */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl p-8" style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
              <div className="mb-4 p-2.5 rounded-lg inline-flex" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <GitPullRequest size={18} style={{ color: '#888' }} />
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ color: '#fff' }}>PR Velocity Tracking</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#666' }}>
                Measure time-to-merge, review cycles, and bottleneck analysis for every pull request across all repositories.
              </p>
            </div>
            <div className="rounded-2xl p-8" style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
              <div className="mb-4 p-2.5 rounded-lg inline-flex" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <Code2 size={18} style={{ color: '#888' }} />
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ color: '#fff' }}>Code Quality Scores</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#666' }}>
                Automated quality assessments based on commit patterns, review coverage, test integration, and technical debt indicators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ SECTION: Start building — visualization ═══════════════════════ */}
      <section className="w-full max-w-6xl mx-auto px-6 md:px-10 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] mb-4 font-medium" style={{ color: '#555' }}>
              Intelligence Layer
            </p>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-6" style={{ color: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>
              <KineticTextReveal
                splitBy="words"
                direction="up"
                blur={true}
                stagger={0.08}
                autoPlay={true}
              >
                Start building with your team today
              </KineticTextReveal>
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: '#666' }}>
              Our intelligence layer connects to your existing tools and turns raw development activity into beautiful, actionable insights.
            </p>

            {/* Mini feature list */}
            <div className="space-y-4">
              {[
                { icon: <Zap size={16} />, label: "Real-time sync with GitHub, GitLab, and Bitbucket" },
                { icon: <Layers size={16} />, label: "Multi-repo aggregation and cross-project insights" },
                { icon: <Activity size={16} />, label: "AI-powered recommendations and anomaly detection" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <span style={{ color: '#888' }}>{item.icon}</span>
                  </div>
                  <span className="text-sm" style={{ color: '#888' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics visualization */}
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <Image 
              src="/feature-analytics.png" 
              alt="Analytics Visualization"
              width={600}
              height={500}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════ SECTION: All that is for how you work ═══════════════════════ */}
      <section className="w-full max-w-6xl mx-auto px-6 md:px-10 py-24">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.25em] mb-4 font-medium" style={{ color: '#555' }}>
            Built for scale
          </p>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight" style={{ color: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>
            <KineticTextReveal
              splitBy="words"
              direction="up"
              blur={true}
              stagger={0.08}
              autoPlay={true}
            >
              All that is for how you work
            </KineticTextReveal>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { icon: <GitBranch size={18} />, title: "Git Integration", desc: "Connect any Git provider in seconds. GitHub, GitLab, Bitbucket — all unified." },
            { icon: <BarChart3 size={18} />, title: "DORA Dashboard", desc: "Industry-standard DORA metrics with automated data collection and reporting." },
            { icon: <Shield size={18} />, title: "Privacy First", desc: "We never read your source code. Only metadata and activity signals are processed." },
            { icon: <Users size={18} />, title: "Team Insights", desc: "Aggregate and compare team performance with org-level analytics and benchmarks." },
            { icon: <Zap size={18} />, title: "Real-time Sync", desc: "Webhook-powered real-time data ingestion. See changes reflected in minutes." },
            { icon: <Layers size={18} />, title: "Custom Reports", desc: "Build and export custom reports for stakeholders with one-click PDF generation." },
          ].map((item, i) => (
            <div 
              key={i} 
              className="rounded-2xl p-6 transition-all duration-300 hover:border-[rgba(255,255,255,0.15)]"
              style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
            >
              <div className="mb-4 p-2.5 rounded-lg inline-flex" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#888' }}>{item.icon}</span>
              </div>
              <h3 className="text-base font-medium mb-2" style={{ color: '#fff' }}>{item.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#666' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════ CTA SECTION ═══════════════════════ */}
      <section className="w-full max-w-6xl mx-auto px-6 md:px-10 py-24">
        <div className="rounded-2xl p-12 md:p-16 text-center relative overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
          {/* Subtle radial glow */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 60%)'
          }} />
          
          <p className="text-xs uppercase tracking-[0.25em] mb-4 font-medium relative z-10" style={{ color: '#555' }}>
            Get started today
          </p>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6 relative z-10" style={{ color: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>
            <KineticTextReveal
              splitBy="words"
              direction="up"
              blur={true}
              stagger={0.08}
              autoPlay={true}
            >
              Contribute to your team's intelligence
            </KineticTextReveal>
          </h2>
          <p className="text-sm mb-10 max-w-lg mx-auto relative z-10" style={{ color: '#666' }}>
            Join engineering teams who are already using DevMetrics to understand and improve their development workflow.
          </p>

          {/* Email + CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto relative z-10">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full sm:flex-1 px-5 py-3 text-sm rounded-full outline-none transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#e0e0e0',
              }}
            />
            <Link 
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-medium px-7 py-3 rounded-full transition-all duration-200 whitespace-nowrap"
              style={{ background: '#fff', color: '#0a0a0a' }}
            >
              Get Started <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ FOOTER ═══════════════════════ */}
      <footer className="w-full max-w-6xl mx-auto px-6 md:px-10 py-16" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 no-underline mb-4">
              <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="3" fill="white" />
                <circle cx="28" cy="8" r="3" fill="white" />
                <circle cx="8" cy="20" r="3" fill="white" />
                <circle cx="20" cy="20" r="3" fill="white" />
                <circle cx="32" cy="20" r="3" fill="white" />
                <circle cx="12" cy="32" r="3" fill="white" />
                <circle cx="28" cy="32" r="3" fill="white" />
              </svg>
              <span className="text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: '#999' }}>
                DevMetrics
              </span>
            </Link>
            <p className="text-xs leading-relaxed max-w-xs" style={{ color: '#555' }}>
              Engineering intelligence for high-performing teams. Know your Developer DNA.
            </p>
          </div>

          {/* Product */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] mb-2" style={{ color: '#777' }}>Product</h4>
            <Link href="/login" className="text-xs transition-colors hover:text-white" style={{ color: '#555' }}>Login</Link>
            <Link href="/signup" className="text-xs transition-colors hover:text-white" style={{ color: '#555' }}>Sign Up</Link>
            <Link href="/docs" className="text-xs transition-colors hover:text-white" style={{ color: '#555' }}>Documentation</Link>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] mb-2" style={{ color: '#777' }}>Legal</h4>
            <Link href="/terms" className="text-xs transition-colors hover:text-white" style={{ color: '#555' }}>Terms of Service</Link>
            <Link href="/privacy" className="text-xs transition-colors hover:text-white" style={{ color: '#555' }}>Privacy Policy</Link>
            <Link href="/cookies" className="text-xs transition-colors hover:text-white" style={{ color: '#555' }}>Cookies</Link>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] mb-2" style={{ color: '#777' }}>Company</h4>
            <Link href="/contact" className="text-xs transition-colors hover:text-white" style={{ color: '#555' }}>Contact Us</Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-xs" style={{ color: '#444' }}>
            © {new Date().getFullYear()} DevMetrics. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-xs transition-colors hover:text-white" style={{ color: '#444' }}>Terms</Link>
            <Link href="/privacy" className="text-xs transition-colors hover:text-white" style={{ color: '#444' }}>Privacy</Link>
            <Link href="/cookies" className="text-xs transition-colors hover:text-white" style={{ color: '#444' }}>Cookies</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════ COMPONENTS ═══════════════════════ */

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div 
      className="rounded-2xl p-7 transition-all duration-300 hover:border-[rgba(255,255,255,0.15)] group"
      style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
    >
      <div className="mb-5 p-2.5 rounded-lg inline-flex transition-all duration-300" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <span style={{ color: '#888' }}>{icon}</span>
      </div>
      <h3 className="text-lg font-medium mb-2.5" style={{ color: '#fff' }}>{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: '#666' }}>
        {description}
      </p>
    </div>
  );
}
