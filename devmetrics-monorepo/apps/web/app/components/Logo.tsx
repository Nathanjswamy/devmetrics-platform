"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface LogoProps {
  iconOnly?: boolean;
  className?: string;
  href?: string;
}

export function Logo({ iconOnly = false, className = "", href = "/" }: LogoProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Using a highly polished SVG that matches the "futuristic translucent 3D monogram" 
  // with glassmorphism and neon blue-to-purple gradients described in the spec.
  // This ensures perfect scaling and zero loading flash while acting as the primary mark.
  const LogoIcon = () => (
    <div className="relative flex items-center justify-center shrink-0 w-8 h-8 md:w-9 md:h-9 transition-transform duration-500 group-hover:scale-105">
      {/* Background Glow */}
      <div className="absolute inset-0 rounded-lg blur-md bg-gradient-to-tr from-[#00f2fe] to-[#4facfe] opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
      
      {/* Glassmorphism Hexagon/Cube Base */}
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-lg"
      >
        <defs>
          <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="100%" stopColor="#4facfe" />
          </linearGradient>
          <linearGradient id="neonGradientPurple" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8a2387" />
            <stop offset="50%" stopColor="#e94057" />
            <stop offset="100%" stopColor="#f27121" />
          </linearGradient>
          <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.05)" />
          </linearGradient>
          <filter id="glassBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Isometric Hexagon (Glass) */}
        <path 
          d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" 
          fill="url(#glassGradient)" 
          stroke="url(#neonGradient)" 
          strokeWidth="3"
          strokeLinejoin="round"
          style={{ filter: "url(#glassBlur)" }}
        />

        {/* Inner Isometric Cube Lines */}
        <path d="M50 5 L50 45" stroke="url(#neonGradient)" strokeWidth="2" strokeOpacity="0.5" />
        <path d="M10 25 L50 45 L90 25" stroke="url(#neonGradient)" strokeWidth="2" strokeOpacity="0.5" strokeLinejoin="round" />

        {/* Letter D (Left side) */}
        <path 
          d="M25 40 L25 65 L45 75 L45 50 Z" 
          fill="none" 
          stroke="url(#neonGradient)" 
          strokeWidth="4" 
          strokeLinejoin="round" 
        />
        
        {/* Letter M (Right side) */}
        <path 
          d="M55 55 L55 80 L75 70 L75 45 L65 50 L55 40" 
          fill="none" 
          stroke="url(#neonGradientPurple)" 
          strokeWidth="4" 
          strokeLinejoin="round"
        />

        {/* Circuitry Dots */}
        <circle cx="25" cy="40" r="3" fill="#00f2fe" />
        <circle cx="45" cy="75" r="3" fill="#00f2fe" />
        <circle cx="55" cy="80" r="3" fill="#f27121" />
        <circle cx="75" cy="45" r="3" fill="#f27121" />
      </svg>
    </div>
  );

  return (
    <Link 
      href={href} 
      className={`group flex items-center gap-3 transition-all duration-300 ${!mounted ? 'opacity-0' : 'opacity-100 animate-in fade-in duration-700'} ${className}`}
    >
      <LogoIcon />
      
      {!iconOnly && (
        <div className="font-sans font-bold text-xl md:text-2xl tracking-tight flex items-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-text-secondary">
            Dev
          </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00f2fe] to-[#4facfe]">
            Metrics
          </span>
        </div>
      )}
    </Link>
  );
}
