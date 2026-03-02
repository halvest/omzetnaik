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
        primary: '#0B0F3B',      // Navy Gelap OmzetNaik
        primarySoft: '#131A5C',  // Navy Muda (untuk card)
        accent: '#FF2E2E',       // Merah CTA
        light: '#F4F4F4',        // Abu terang
        textSoft: '#CFCFCF'
      },
      container: {
        center: true,
        padding: "2rem",
      },
    },
  },
  plugins: [],
};
export default config;