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
        background: "#F8F6F1", // Warm Ivory
        surface: "#F4EFE6", // Soft Cream
        "surface-2": "#EAE4D9", // Stone White / Light Sand
        "surface-3": "#DFD8C8", // Pale Beige
        border: "#D5CEBC", // Muted structural border
        "border-bright": "#C2B9A6",
        "text-primary": "#2C2A26", // Deep charcoal for readability
        "text-secondary": "#5C584E", // Softer text
        "text-muted": "#8C867A",
        // Bauhaus / Picasso Accent Colors
        accent: {
          terracotta: "#D05A44",
          orange: "#DE7A35",
          teal: "#2B6B6D",
          blue: "#53798C",
          olive: "#787B4E",
          gold: "#D4AF37"
        }
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
