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
        background: "#FAF7F2", // Warm Ivory
        surface: "#FFFFFF", // Pure white for cards
        "surface-2": "#F4F0E6", // Light sand
        "surface-3": "#EAE4D9", 
        border: "#E2E8F0", // Clean crisp border
        "border-bright": "#CBD5E1",
        "text-primary": "#0F172A", // Deep Navy
        "text-secondary": "#475569", // Softer slate
        "text-muted": "#94A3B8",
        accent: {
          navy: "#0F172A",
          orange: "#C86A3D", // Burnt Orange
          green: "#7A8B6F", // Sage Green
          gold: "#B99B5F", // Dusty Gold
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Playfair Display", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
