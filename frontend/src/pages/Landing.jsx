import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, GitPullRequest, LayoutDashboard, Bug, Rocket, CheckCircle2 } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[var(--color-obsidian-canvas)] text-[var(--color-bone-white)] overflow-hidden font-['Inter',ui-sans-serif,system-ui]">
      
      {/* Navigation */}
      <header className="max-w-[1200px] mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <Activity className="w-5 h-5 text-[var(--color-bone-white)]" />
          <span className="font-['Oswald'] font-black text-xl tracking-tight leading-none text-[var(--color-bone-white)] mt-1">
            devmetrics
          </span>
        </div>

        {/* Centered Nav Pill */}
        <nav className="absolute left-1/2 -translate-x-1/2 rounded-[9999px] bg-[var(--color-graphite-layer)]/80 backdrop-blur-sm border border-[var(--color-ash-border)]/20 px-2 py-1.5 hidden md:flex items-center gap-4">
          {['RELEASES', 'RESOURCES', 'COMPANY', 'PRICING'].map(item => (
            <a key={item} href="#" className="text-[12px] font-semibold uppercase text-[var(--color-bone-white)] tracking-[0.071em] hover:text-[var(--color-bronze-glow)] transition-colors px-2">
              {item}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="text-[12px] font-semibold uppercase text-[var(--color-bone-white)] tracking-[0.071em] hover:text-[var(--color-bronze-glow)] transition-colors">
            SIGN IN
          </Link>
          <Link to="/dashboard" className="bg-[var(--color-bone-white)] text-[var(--color-obsidian-canvas)] font-semibold text-[14px] uppercase tracking-[0.063em] px-7 py-3 rounded-[6px] hover:bg-[var(--color-cream-paper)] transition-colors">
            GET STARTED
          </Link>
        </div>
      </header>

      <main className="relative z-10 pt-24 pb-20 max-w-[1200px] mx-auto px-6">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center max-w-[800px] mx-auto mb-20">
          {/* Announcement Banner */}
          <div className="mb-8 text-[14px] text-[var(--color-ash-border)] font-normal flex items-center gap-1.5">
            <span className="font-bold text-[var(--color-bone-white)]">New release</span>
            <span>—</span>
            <span>Intelligence is now live. Read the full story</span>
            <a href="#" className="text-[var(--color-bronze-glow)] inline-flex items-center hover:underline">
              <ArrowRight className="w-3 h-3 ml-0.5" />
            </a>
          </div>

          <h1 className="font-['Oswald'] font-black text-[64px] leading-[1] text-[var(--color-bone-white)] tracking-[0.014em] mb-6">
            Every deployment, searchable.
          </h1>

          <p className="text-[16px] leading-[1.38] text-[var(--color-ash-border)] max-w-[600px] mx-auto mb-10">
            DevMetrics brings together every pull request, issue, and deployment. Automatically organized, intelligently searchable, always up to date. For you and your team.
          </p>

          <Link to="/dashboard" className="bg-[var(--color-bone-white)] text-[var(--color-obsidian-canvas)] font-semibold text-[14px] uppercase tracking-[0.063em] px-7 py-3 rounded-[6px] transition-all inline-flex">
            GET DEVMETRICS FREE
          </Link>
        </div>

        {/* Product Mockup Card */}
        <div className="relative mx-auto max-w-[1024px] rounded-[16px] bg-[var(--color-graphite-layer)] border border-[var(--color-ash-border)]/40 shadow-[rgba(0,0,0,0.06)_0px_0px_0px_1px,rgba(0,0,0,0.08)_-8px_12px_22px_0px] overflow-hidden min-h-[460px] flex z-10">
          
          {/* Sidebar */}
          <div className="w-[240px] border-r border-[var(--color-ash-border)]/20 p-4 flex flex-col hidden md:flex">
             <div className="flex items-center gap-2 mb-8 px-2 mt-2">
                <Activity className="w-4 h-4 text-[var(--color-bone-white)]" />
                <span className="font-['Oswald'] font-bold text-sm tracking-wide text-[var(--color-bone-white)] mt-1">devmetrics</span>
             </div>
             
             {/* Search input mockup */}
             <div className="mb-4 px-2">
               <div className="bg-[var(--color-obsidian-canvas)] border border-[var(--color-ash-border)]/20 rounded-md px-3 py-2 flex items-center gap-2">
                 <span className="text-[var(--color-ash-border)] text-xs">🔍</span>
                 <span className="text-[var(--color-ash-border)] text-[12px]">Search</span>
               </div>
             </div>

             <div className="space-y-1 mt-2">
                <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-[var(--color-ash-border)]/10 text-[var(--color-bone-white)] text-[14px]">
                   <LayoutDashboard className="w-4 h-4" />
                   <span>Home</span>
                </div>
                <div className="flex items-center gap-3 px-3 py-2 rounded-md text-[var(--color-ash-border)] hover:bg-[var(--color-ash-border)]/5 text-[14px]">
                   <Activity className="w-4 h-4" />
                   <span>Activity</span>
                </div>
                <div className="flex items-center gap-3 px-3 py-2 rounded-md text-[var(--color-ash-border)] hover:bg-[var(--color-ash-border)]/5 text-[14px]">
                   <GitPullRequest className="w-4 h-4" />
                   <span>Reviews</span>
                </div>
             </div>
          </div>

          {/* Main Feed */}
          <div className="flex-1 p-6 border-r border-[var(--color-ash-border)]/20 flex flex-col">
             <div className="flex items-center justify-between mb-6 px-2 border-b border-[var(--color-ash-border)]/20 pb-4">
               <h3 className="font-semibold text-[16px] text-[var(--color-bone-white)] tracking-[0.05em]">Home</h3>
               <div className="flex gap-4">
                 <span className="text-[10px] font-bold text-[var(--color-slate-mute)] tracking-[0.167em]">NOW</span>
                 <span className="text-[10px] font-bold text-[var(--color-bronze-glow)] tracking-[0.167em]">UPCOMING +</span>
               </div>
             </div>
             <div className="space-y-0">
                {[
                  { name: 'Clarisse Moreau', action: 'merged pull request #492', time: '1m', icon: <GitPullRequest className="w-3 h-3 text-[var(--color-bone-white)]" /> },
                  { name: 'Tamika Lovalina', action: 'deployed v1.4.2 to production', time: '6h', icon: <Rocket className="w-3 h-3 text-[var(--color-bronze-glow)]" /> },
                  { name: 'Eric Nomar', action: 'resolved incident #183', time: '9h', icon: <CheckCircle2 className="w-3 h-3 text-[#10b981]" /> },
                  { name: 'Marcus Chen', action: 'reported bug in auth flow', time: '1d', icon: <Bug className="w-3 h-3 text-[#ef4444]" /> }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 px-2 py-4 border-b border-[var(--color-ash-border)]/10 last:border-0 hover:bg-[var(--color-obsidian-canvas)]/30 rounded-md transition-colors cursor-pointer">
                    <div className="w-7 h-7 rounded-[36px] bg-[var(--color-obsidian-canvas)] border border-[var(--color-ash-border)]/20 flex items-center justify-center text-[10px] font-bold text-[var(--color-bone-white)] relative">
                       {item.name.charAt(0)}
                       <div className="absolute -bottom-1 -right-1 bg-[var(--color-graphite-layer)] rounded-[36px] p-0.5">
                         {item.icon}
                       </div>
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="text-[14px] truncate">
                         <span className="text-[var(--color-bone-white)] font-semibold">{item.name}</span>{' '}
                         <span className="text-[var(--color-ash-border)]">{item.action}</span>
                       </p>
                    </div>
                    <span className="text-[12px] text-[var(--color-slate-mute)]">{item.time}</span>
                  </div>
                ))}
             </div>
          </div>

          {/* Detail Panel */}
          <div className="w-[300px] p-6 hidden lg:flex flex-col">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 rounded-[36px] bg-[var(--color-obsidian-canvas)] border border-[var(--color-ash-border)]/20 flex items-center justify-center text-[18px] font-bold text-[var(--color-bone-white)]">
                  CM
               </div>
               <div>
                 <h3 className="font-semibold text-[14px] text-[var(--color-bone-white)]">Clarisse Moreau</h3>
                 <p className="text-[10px] uppercase font-bold tracking-[0.167em] text-[var(--color-slate-mute)] mt-1">LOS ANGELES, US</p>
               </div>
            </div>

            <div className="mb-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.167em] text-[var(--color-slate-mute)] mb-4 block">NETWORK STRENGTH</span>
              <div className="flex items-center gap-2 bg-[var(--color-obsidian-canvas)]/50 border border-[var(--color-ash-border)]/20 rounded-[12px] px-3 py-1.5 w-fit">
                <Activity className="w-3 h-3 text-[var(--color-bronze-glow)]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.167em] text-[var(--color-bone-white)]">HIGH</span>
              </div>
            </div>
            
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.167em] text-[var(--color-slate-mute)] mb-4 block">TIMELINE</span>
              <p className="text-[14px] text-[var(--color-bone-white)] font-['PT_Serif'] italic text-[22px] leading-[1.55]">
                "The most connected engineer on the platform this week."
              </p>
            </div>
          </div>

        </div>

        {/* Social Proof */}
        <div className="mt-32 flex flex-col items-center relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.167em] text-[var(--color-slate-mute)] mb-8">
            TRUSTED BY ENGINEERING TEAMS AT
          </span>
          <div className="flex items-center gap-12 md:gap-16 opacity-40 hover:opacity-100 transition-all duration-500 text-[var(--color-bone-white)] font-['Oswald'] font-bold text-[24px] tracking-widest uppercase">
             <span>Notion</span>
             <span>Disney</span>
             <span>Stanford</span>
             <span>IDEO</span>
             <span>Tumblr</span>
          </div>
        </div>

      </main>

      {/* Atmospheric Wash Background */}
      <div className="absolute bottom-0 left-0 right-0 h-[800px] pointer-events-none z-0" 
           style={{ 
             background: 'var(--color-amber-wash)',
             opacity: 0.15,
             filter: 'blur(120px)',
             transform: 'translateY(40%)'
           }} />
           
      {/* Footer */}
      <footer className="relative z-10 max-w-[1200px] mx-auto px-6 py-12 border-t border-[var(--color-ash-border)]/20 mt-12">
        <div className="flex items-center justify-between">
           <span className="text-[12px] text-[var(--color-slate-mute)] font-['Inter']">© 2026 DevMetrics. All rights reserved.</span>
           <div className="flex gap-6">
              <a href="#" className="text-[14px] text-[var(--color-ash-border)] hover:text-[var(--color-bronze-glow)] hover:underline decoration-[var(--color-bronze-glow)] transition-all font-['Inter']">Twitter</a>
              <a href="#" className="text-[14px] text-[var(--color-ash-border)] hover:text-[var(--color-bronze-glow)] hover:underline decoration-[var(--color-bronze-glow)] transition-all font-['Inter']">GitHub</a>
              <a href="#" className="text-[14px] text-[var(--color-ash-border)] hover:text-[var(--color-bronze-glow)] hover:underline decoration-[var(--color-bronze-glow)] transition-all font-['Inter']">Discord</a>
           </div>
        </div>
      </footer>
    </div>
  );
}
