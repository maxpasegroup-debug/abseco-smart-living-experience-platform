import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./ui/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        abseco: {
          orange: "#FF6A00",
          blue: "#3B82F6",
          bg: "#020617",
          bgMid: "#0f172a"
        }
      },
      backgroundImage: {
        "abseco-dark": "linear-gradient(180deg, #020617 0%, #0f172a 40%, #020617 100%)",
        "luxury-gradient": "linear-gradient(180deg, rgba(2,6,23,0.4) 0%, rgba(15,23,42,0.6) 50%, rgba(2,6,23,0.95) 100%)"
      },
      boxShadow: {
        glow: "0 0 24px rgba(59, 130, 246, 0.35)",
        "glow-strong": "0 0 40px rgba(59, 130, 246, 0.4)",
        "accent-glow": "0 0 32px rgba(59, 130, 246, 0.25)",
        orange: "0 0 24px rgba(255, 106, 0, 0.35)",
        "orange-hover": "0 0 40px rgba(255, 106, 0, 0.5), 0 0 60px rgba(255, 106, 0, 0.2)",
        "card-lift": "0 24px 48px -12px rgba(0,0,0,0.5)",
        "inner-glow": "inset 0 0 60px rgba(255, 106, 0, 0.08)",
        "step-glow": "0 0 20px rgba(255, 106, 0, 0.5)"
      },
      borderRadius: {
        xl2: "1.25rem",
        "2xl": "1rem",
        "3xl": "1.5rem"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-sora)", "system-ui", "sans-serif"]
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "glow-pulse": "glowPulse 2.5s ease-in-out infinite"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 24px rgba(255, 106, 0, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(255, 106, 0, 0.5)" }
        }
      },
      transitionDuration: {
        "400": "400ms"
      }
    }
  },
  plugins: []
};

export default config;
