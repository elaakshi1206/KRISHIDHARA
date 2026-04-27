import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          green: "#15803d",
          "green-light": "#dcfce7",
          "green-dark": "#166534",
        },
        soil: {
          brown: "#8D6E63",
          "brown-light": "#D7CCC8",
          "brown-dark": "#5D4037",
        },
        accent: {
          saffron: "#F59E0B",
          gold: "#fbbf24",
        },
      },
    },
  },
  plugins: [],
};
export default config;
