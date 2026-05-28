import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#fdfaf4",
          100: "#faf5ea",
          200: "#f3ecdc",
          300: "#e9dec5",
        },
        ink: {
          50: "#f5f5f4",
          100: "#e7e5e1",
          200: "#cfcbc4",
          300: "#a8a39a",
          400: "#736e64",
          500: "#4a463f",
          600: "#2d2a25",
          700: "#1c1a17",
          800: "#121110",
          900: "#0a0a09",
        },
        emerald: {
          50: "#f0f6f3",
          100: "#dbe9e0",
          200: "#b7d2c1",
          300: "#8bb59c",
          400: "#5e9377",
          500: "#3d735a",
          600: "#1f5c44",
          700: "#174633",
          800: "#103324",
          900: "#0a2218",
        },
        brass: {
          400: "#c89c4e",
          500: "#a37e2c",
          600: "#8a691f",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Fraunces", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.2em",
      },
    },
  },
  plugins: [],
};

export default config;
