import type { Metadata } from "next";
import Image from "next/image";
import "../globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DevMetrics",
  description: "Engineering Intelligence Platform",
  openGraph: {
    title: "DevMetrics",
    description: "Engineering Intelligence Platform",
    images: [{ url: "/logo-full.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevMetrics",
    description: "Engineering Intelligence Platform",
    images: ["/logo-full.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

import { Scene3DWrapper } from "../components/Scene3DWrapper";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased m-0 p-0 overflow-hidden" style={{ background: '#0a0a0a' }}>
        
        {/* Full screen 3D Scene running behind everything */}
        <div className="absolute inset-0 z-0">
          <Scene3DWrapper />
        </div>

        <div className="min-h-screen flex flex-col lg:flex-row relative z-10 pointer-events-none">
          {/* Left Panel - Branding */}
          <div className="hidden lg:flex flex-col w-1/2 relative p-10 pt-10">
            {/* Subtle gradient overlay to darken edges slightly */}
            <div className="absolute inset-0" style={{
              background: 'radial-gradient(ellipse at 30% 60%, rgba(10,10,10,0) 0%, rgba(10,10,10,0.8) 100%)'
            }} />

            {/* Brand name */}
            <div className="relative z-20 pointer-events-auto">
              <Link href="/" className="inline-flex items-center gap-2.5 no-underline group">
                <span className="text-sm font-semibold tracking-[0.2em] uppercase" style={{ color: '#e0e0e0' }}>
                  DevMetrics
                </span>
                <span className="text-[8px] align-super font-medium" style={{ color: '#666' }}>®</span>
              </Link>
            </div>
          </div>

          {/* Right Panel - Auth Form */}
          <div 
            className="w-full lg:w-1/2 flex items-center justify-center min-h-screen relative pointer-events-auto" 
            style={{ 
              background: 'linear-gradient(90deg, rgba(10,10,10,0) 0%, rgba(10,10,10,0.85) 15%, rgba(10,10,10,1) 100%)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="w-full max-w-sm px-8 py-12 lg:px-0 relative z-20">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
