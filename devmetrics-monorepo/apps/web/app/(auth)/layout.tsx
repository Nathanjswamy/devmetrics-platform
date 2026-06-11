import type { Metadata } from "next";
import Image from "next/image";
import "../globals.css";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "../components/BrandLogo";

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
      <body className="bg-background text-text-primary antialiased min-h-screen flex flex-col md:flex-row m-0 p-0 overflow-hidden">
        {/* Left Panel - Visuals (70%) */}
        <div className="hidden lg:flex flex-col justify-between w-[70%] bg-[#060c18] relative overflow-hidden">
          {/* Background Hero Image */}
          <Image 
            src="/hero-globe.png" 
            alt="DevMetrics Background" 
            fill
            className="object-cover opacity-60 z-0 mix-blend-screen"
            priority
          />
          
          {/* Dark gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060c18] via-[#060c18]/40 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#060c18]/80 to-transparent z-10 pointer-events-none"></div>

          {/* Branding Header */}
          <div className="relative z-20 flex items-center gap-2 p-12">
            <BrandLogo href="/" />
          </div>

          {/* Value Prop */}
          <div className="relative z-20 p-12 pb-24 max-w-2xl">
            <h1 className="text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6 text-white drop-shadow-lg">
              Know Your Developer DNA.
            </h1>
            <p className="text-xl text-blue-100 font-light drop-shadow-md">
              Transform commits, pull requests, code reviews, and deployments into actionable engineering intelligence.
            </p>
          </div>
        </div>

        {/* Right Panel - Auth Form (30%) */}
        <div className="w-full lg:w-[30%] flex items-center justify-center p-8 bg-white text-gray-900 h-screen overflow-y-auto">
          <div className="w-full max-w-sm">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
