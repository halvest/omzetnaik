/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0F1F4A", // Midnight Navy
          light: "#1E3A8A",
          dark: "#08112B",
        },
        secondary: "#1E3A8A", // Royal Blue
        accent: {
          DEFAULT: "#FF3B3B", // Growth Red
          hover: "#E22F2F",
          soft: "rgba(255, 59, 59, 0.1)",
        },
        neutral: {
          soft: "#F8FAFC", // Lebih bersih untuk background
          border: "#F1F5F9",
          slate: "#64748B",
        },
        dark: "#0F172A",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #0F1F4A 0%, #1E3A8A 100%)",
        "glass-gradient":
          "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Poppins", "sans-serif"], // Konsisten dengan brand
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        premium: "0 20px 50px -12px rgba(15, 31, 74, 0.12)",
        "accent-glow": "0 10px 30px -5px rgba(255, 59, 59, 0.3)",
      },
    },
  },
  plugins: [],
};
