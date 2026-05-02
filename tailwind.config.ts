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
        "primary-green": "var(--primary-green)",
        "primary-green-light": "var(--primary-green-light)",
        "primary-green-dark": "var(--primary-green-dark)",
        "primary-green-xlight": "var(--primary-green-xlight)",
        "yellow-accent": "var(--yellow-accent)",
        "yellow-light": "var(--yellow-light)",
        "yellow-dark": "var(--yellow-dark)",
      },
    },
  },
  plugins: [],
};
export default config;
