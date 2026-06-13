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
        background: "#0B0809",
        surface: "#110D0E",
        "surface-2": "#1A1314",
        "surface-3": "#221A1B",
        border: "rgba(255, 220, 220, 0.06)",
        "border-bright": "rgba(255, 200, 200, 0.12)",
        "text-primary": "#F5EDE8",
        "text-secondary": "#A89490",
        "text-muted": "#5C4B4B",
        accent: {
          maroon: "#8B1A2A",
          "maroon-light": "#A62035",
          gold: "#C9A96E",
          "gold-light": "#D4BA85",
          teal: "#2C7873",
          "teal-light": "#3A9B95",
          // semantic
          red: "#A62035",
          amber: "#B8752E",
          green: "#4A7C59",
          // legacy compat aliases
          navy: "#8B1A2A",
          orange: "#B8752E",
          blue: "#2C7873",
          cyan: "#3A9B95",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Playfair Display", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2.5s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-down": "slide-down 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
