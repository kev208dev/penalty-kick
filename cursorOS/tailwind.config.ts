import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#05070d",
        panel: "rgba(10, 14, 24, 0.78)",
        cyanGlow: "#27f2ff",
        pinkGlow: "#ff3bd5",
        volt: "#d8ff4f"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"]
      },
      boxShadow: {
        glow: "0 0 32px rgba(39, 242, 255, 0.22)",
        pink: "0 0 32px rgba(255, 59, 213, 0.2)"
      }
    }
  },
  plugins: []
};

export default config;
