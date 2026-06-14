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

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased m-0 p-0 overflow-hidden" style={{ background: '#111111' }}>
        <div className="min-h-screen flex flex-col lg:flex-row">
          {/* Left Panel - Decorative with floating orbs */}
          <div className="hidden lg:flex flex-col w-1/2 relative overflow-hidden" style={{ background: '#0e0e0e' }}>
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'radial-gradient(ellipse at 30% 60%, rgba(255,255,255,0.02) 0%, transparent 70%)'
            }} />

            {/* Brand name */}
            <div className="relative z-20 p-10 pt-10">
              <Link href="/" className="inline-flex items-center gap-2.5 no-underline group">
                <span className="text-sm font-semibold tracking-[0.2em] uppercase" style={{ color: '#e0e0e0' }}>
                  DevMetrics
                </span>
                <span className="text-[8px] align-super font-medium" style={{ color: '#666' }}>®</span>
              </Link>
            </div>

            {/* Floating orbs image - centered */}
            <div className="flex-1 relative flex items-center justify-center">
              <div className="relative w-[70%] h-[70%]">
                <Image
                  src="/auth-orbs.png"
                  alt="Decorative floating orbs"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Right Panel - Auth Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center min-h-screen relative" style={{ background: '#141414' }}>
            {/* Subtle left border separator */}
            <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            
            <div className="w-full max-w-sm px-8 py-12 lg:px-0">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
