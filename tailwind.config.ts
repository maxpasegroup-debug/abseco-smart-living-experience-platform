import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./ui/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        abseco: {
          orange: "#FF6A00",
          blue: "#3B82F6"
        }
      },
      backgroundImage: {
        "abseco-dark": "linear-gradient(160deg, #0f172a 0%, #020617 60%, #0f172a 100%)"
      },
      boxShadow: {
        glow: "0 0 24px rgba(59, 130, 246, 0.35)",
        orange: "0 0 24px rgba(255, 106, 0, 0.35)"
      },
      borderRadius: {
        xl2: "1.25rem"
      }
    }
  },
  plugins: []
};

export default config;
