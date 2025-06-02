import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ["var(--font-cinzel)"],
        bebas: ["var(--font-bebas)"],
        rajdhani: ["var(--font-rajdhani)"],
        anton: ["var(--font-anton)"],
      },
      colors: {
        brand: "#ebc660", // 🟡 Màu thương hiệu
      },
      keyframes: {
        fire: {
          "0%, 100%": { transform: "scale(1)", opacity: 1 },
          "50%": { transform: "scale(1.1)", opacity: 0.8 },
        },
      },
      animation: {
        fire: "fire 0.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
