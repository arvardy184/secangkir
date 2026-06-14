import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        kopi: {
          50:  "#fdf8f0",
          100: "#f5e6d0",
          200: "#e8ccaa",
          300: "#d4a574",
          500: "#8B5E3C",
          700: "#5C3D1E",
          900: "#2C1810",
        },
      },
      fontFamily: {
        sans:    ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Lora", "Georgia", "ui-serif", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
