import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        display: ["Fraunces", "serif"],
      },
      colors: {
        green: { DEFAULT: "#16a34a", light: "#dcfce7", mid: "#86efac", dark: "#14532d" },
        surface: { DEFAULT: "#ffffff", 2: "#f8fafc", 3: "#f1f5f9" },
      },
      borderRadius: { DEFAULT: "14px", sm: "8px", lg: "20px", xl: "28px" },
      boxShadow: {
        card: "0 4px 16px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)",
        "card-hover": "0 12px 40px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.04)",
        green: "0 4px 12px rgba(22,163,74,0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
