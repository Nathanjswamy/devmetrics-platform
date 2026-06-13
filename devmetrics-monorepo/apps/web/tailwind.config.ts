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
        /* === Dala core palette === */
        void:  "#000000",
        bone:  "#ffffff",
        ash:   "#bdbdbd",
        smoke: "#9a9a9a",
        plum:  "#8052ff",
        amber: "#ffb829",
        lichen:"#15846e",

        /* === Component aliases === */
        background: "#000000",
        surface:    "transparent",
        "surface-2": "rgba(255,255,255,0.03)",
        "surface-3": "rgba(255,255,255,0.05)",
        border:      "rgba(255,255,255,0.08)",
        "border-bright": "rgba(255,255,255,0.15)",
        "text-primary":   "#ffffff",
        "text-secondary": "#bdbdbd",
        "text-muted":     "#9a9a9a",

        /* === Semantic / legacy compat === */
        accent: {
          blue:        "#8052ff",
          "blue-hover":"#9166ff",
          "blue-dim":  "rgba(128,82,255,0.12)",
          green:       "#15846e",
          "green-dim": "rgba(21,132,110,0.12)",
          amber:       "#ffb829",
          "amber-dim": "rgba(255,184,41,0.10)",
          red:         "#ff4d6a",
          "red-dim":   "rgba(255,77,106,0.10)",
          indigo:      "#8052ff",
          "indigo-dim":"rgba(128,82,255,0.12)",
          /* legacy */
          navy:   "#ffffff",
          gold:   "#ffb829",
          teal:   "#15846e",
          cyan:   "#15846e",
          maroon: "#ff4d6a",
          "maroon-light": "#ff4d6a",
          "maroon-dim":   "rgba(255,77,106,0.10)",
          violet: "#8052ff",
        },

        /* severity shortcuts */
        "severity-critical": "#ff4d6a",
        "severity-warning":  "#ffb829",
        "severity-success":  "#15846e",
        "severity-info":     "#8052ff",
      },
      fontFamily: {
        sans:  ["Inter", "Space Grotesk", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Inter", "sans-serif"],
        mono:  ["JetBrains Mono", "SF Mono", "Fira Code", "monospace"],
      },
      borderRadius: {
        "4xl": "2rem",
        pill:  "99px",
        dala:  "1.5rem",   /* 24px — the Dala spec radius */
      },
      letterSpacing: {
        "dala-display": "-0.04em",
        "dala-body":    "0.025em",
        "dala-nav":     "0.021em",
        "dala-kicker":  "0.05em",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.4" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-5px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-dot":   "pulse-dot 2.5s ease-in-out infinite",
        "fade-in-up":  "fade-in-up 0.3s cubic-bezier(0.16,1,0.3,1) forwards",
        "slide-down":  "slide-down 0.2s ease forwards",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
