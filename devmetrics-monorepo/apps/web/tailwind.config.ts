import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#F6F8FA",
        surface: "#FFFFFF",
        "surface-2": "#F3F4F6",
        "surface-3": "#E9EDF2",
        border: "#E5E7EB",
        "border-bright": "#D1D5DB",
        "text-primary": "#0F172A",
        "text-secondary": "#4B5563",
        "text-muted": "#9CA3AF",
        accent: {
          blue: "#2563EB",
          "blue-hover": "#1D4ED8",
          "blue-dim": "#EFF6FF",
          green: "#10B981",
          "green-dim": "#ECFDF5",
          amber: "#F59E0B",
          "amber-dim": "#FFFBEB",
          red: "#EF4444",
          "red-dim": "#FEF2F2",
          indigo: "#6366F1",
          "indigo-dim": "#EEF2FF",
          // legacy compatibility aliases
          navy: "#0F172A",
          orange: "#F59E0B",
          gold: "#F59E0B",
          teal: "#10B981",
          cyan: "#0EA5E9",
          maroon: "#DC2626",
          "maroon-light": "#EF4444",
          "maroon-dim": "#FEF2F2",
          violet: "#6366F1",
        },
        // severity shortcuts
        "severity-critical": "#EF4444",
        "severity-warning": "#F59E0B",
        "severity-success": "#10B981",
        "severity-info": "#6366F1",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["Inter", "sans-serif"],   // remove Playfair — not enterprise
        mono: ["JetBrains Mono", "SF Mono", "Fira Code", "monospace"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
        "card-md": "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.04)",
        focus: "0 0 0 3px rgba(37,99,235,0.12)",
        none: "none",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.2s ease forwards",
        "slide-down": "slide-down 0.2s ease forwards",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
