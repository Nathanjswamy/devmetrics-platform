import type { Metadata } from "next";
import Image from "next/image";
import "../globals.css";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "DevMetrics Authentication",
  description: "Understand your engineering identity.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-text-primary antialiased min-h-screen flex flex-col md:flex-row">
        {/* Left Panel - Visuals */}
        <div className="hidden md:flex flex-col justify-between w-1/2 bg-surface border-r border-border relative overflow-hidden p-12">
          {/* Subtle gradient background */}
          <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-gradient-to-br from-[#2B6B6D]/20 via-background to-background z-0"></div>
          
          <div className="relative z-10 flex items-center gap-2 mb-12">
            <div className="w-8 h-8 rounded flex items-center justify-center bg-text-primary">
              <Sparkles size={16} className="text-surface" />
            </div>
            <span className="text-xl font-serif font-bold tracking-tight">DevMetrics</span>
          </div>

          <div className="relative z-10 flex-1 flex flex-col justify-center max-w-lg">
            <h1 className="text-4xl lg:text-5xl font-serif font-bold leading-tight mb-6">
              Understand your engineering identity.
            </h1>
            <p className="text-lg text-text-secondary">
              Transform commits, code reviews, and deployments into actionable insights. Join elite software engineering teams who use DevMetrics to optimize their workflows.
            </p>
          </div>

          <div className="relative z-10 mt-12 rounded-xl overflow-hidden border border-border shadow-2xl translate-y-12 translate-x-12 opacity-80 mix-blend-lighten">
            <Image 
              src="/screenshot-dna.png" 
              alt="Dashboard Preview" 
              width={800} 
              height={500} 
              className="object-cover w-full h-auto"
            />
          </div>
        </div>

        {/* Right Panel - Auth Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-background overflow-y-auto">
          <div className="w-full max-w-sm">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
