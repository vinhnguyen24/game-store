import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: "#ebc660", // 🟡 Màu thương hiệu
      },
    },
  },
  plugins: [],
};

export default config;
