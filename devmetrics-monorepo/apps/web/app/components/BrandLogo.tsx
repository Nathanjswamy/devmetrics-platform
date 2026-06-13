"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface BrandLogoProps {
  iconOnly?: boolean;
  className?: string;
  href?: string;
  size?: "sm" | "md" | "lg";
}

export function BrandLogo({ iconOnly = false, className = "", href = "/", size = "md" }: BrandLogoProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Size mapping
  const sizeMap = {
    sm: { icon: "w-6 h-6", text: "text-lg" },
    md: { icon: "w-8 h-8 md:w-9 md:h-9", text: "text-xl md:text-2xl" },
    lg: { icon: "w-10 h-10 md:w-12 md:h-12", text: "text-2xl md:text-3xl" },
  };

  const currentSize = sizeMap[size];

  const LogoIcon = () => (
    <div className={`relative flex items-center justify-center shrink-0 ${currentSize.icon} transition-transform duration-500 group-hover:scale-105`}>
      {/* Background Glow - improved contrast */}
      <div className="absolute inset-0 rounded-full blur-[10px] bg-gradient-to-tr from-[#00f2fe] via-[#4facfe] to-[#8a2387] opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
      
      {/* Glassmorphism Hexagon/Cube Base */}
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-xl"
      >
        <defs>
          <linearGradient id="neonGradientCyanBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="100%" stopColor="#4facfe" />
          </linearGradient>
          <linearGradient id="neonGradientBluePurple" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4facfe" />
            <stop offset="100%" stopColor="#8a2387" />
          </linearGradient>
          <linearGradient id="glassGradientLogo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.6)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.1)" />
          </linearGradient>
          <filter id="glassBlurLogo" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Isometric Hexagon (Glass) */}
        <path 
          d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" 
          fill="url(#glassGradientLogo)" 
          stroke="url(#neonGradientCyanBlue)" 
          strokeWidth="4"
          strokeLinejoin="round"
          style={{ filter: "url(#glassBlurLogo)" }}
        />

        {/* Inner Isometric Cube Lines */}
        <path d="M50 5 L50 45" stroke="url(#neonGradientCyanBlue)" strokeWidth="3" strokeOpacity="0.7" />
        <path d="M10 25 L50 45 L90 25" stroke="url(#neonGradientCyanBlue)" strokeWidth="3" strokeOpacity="0.7" strokeLinejoin="round" />

        {/* Letter D (Left side) */}
        <path 
          d="M25 40 L25 65 L45 75 L45 50 Z" 
          fill="none" 
          stroke="url(#neonGradientCyanBlue)" 
          strokeWidth="5" 
          strokeLinejoin="round" 
        />
        
        {/* Letter M (Right side) */}
        <path 
          d="M55 55 L55 80 L75 70 L75 45 L65 50 L55 40" 
          fill="none" 
          stroke="url(#neonGradientBluePurple)" 
          strokeWidth="5" 
          strokeLinejoin="round"
        />

        {/* Circuitry Dots */}
        <circle cx="25" cy="40" r="3.5" fill="#00f2fe" />
        <circle cx="45" cy="75" r="3.5" fill="#00f2fe" />
        <circle cx="55" cy="80" r="3.5" fill="#8a2387" />
        <circle cx="75" cy="45" r="3.5" fill="#8a2387" />
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
        <div className={`font-sans font-bold tracking-tight flex items-center ${currentSize.text}`}>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-text-secondary">
            Dev
          </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00f2fe] via-[#4facfe] to-[#8a2387]">
            Metrics
          </span>
        </div>
      )}
    </Link>
  );
}
