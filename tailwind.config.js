/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // Mengaktifkan class-based dark mode untuk fleksibilitas premium
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0F1F4A", // Midnight Navy
          light: "#1E3A8A", // Royal Blue
          dark: "#08112B",
          // Menambahkan tint untuk elemen UI yang halus
          50: "#F0F4FF",
          100: "#E1E9FF",
        },
        accent: {
          DEFAULT: "#FF3B3B", // Growth Red
          hover: "#E22F2F",
          soft: "rgba(255, 59, 59, 0.1)",
        },
        // Slate khusus untuk tipografi yang lebih terbaca (Standard Apple/Vercel)
        slate: {
          900: "#0F172A",
          800: "#1E293B",
          600: "#475569",
          500: "#64748B",
          400: "#94A3B8",
          200: "#E2E8F0",
          50: "#F8FAFC",
        },
      },
      backgroundImage: {
        // Gradasi yang lebih halus (smooth transition)
        "hero-gradient": "linear-gradient(180deg, #0F1F4A 0%, #112659 100%)",
        "glass-gradient":
          "linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02))",
        "surface-gradient":
          "linear-gradient(to bottom, rgba(255, 255, 255, 0.03), transparent)",
      },
      fontFamily: {
        // Inter untuk body (UI modern), Poppins untuk Brand Heading
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
      // Mengurangi radius ekstrem agar terlihat lebih profesional (Standard Silicon Valley)
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        bento: "2rem", // Radius khusus untuk grid bento
      },
      boxShadow: {
        // Shadow berlapis (Layered Shadows) agar tidak terlihat "berdebu"
        premium:
          "0 1px 2px rgba(15, 31, 74, 0.05), 0 8px 24px -8px rgba(15, 31, 74, 0.08)",
        "premium-hover":
          "0 2px 4px rgba(15, 31, 74, 0.02), 0 20px 48px -12px rgba(15, 31, 74, 0.12)",
        "accent-glow": "0 0 20px -5px rgba(255, 59, 59, 0.4)",
      },
      animation: {
        // Animasi halus untuk elemen tech
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      transitionDuration: {
        DEFAULT: "400ms", // Sedikit lebih lambat untuk kesan "weighty" dan premium
      },
      transitionTimingFunction: {
        // Cubic bezier standar Linear/Apple untuk gerakan yang organik
        premium: "cubic-bezier(0.2, 0, 0, 1)",
      },
    },
  },
  plugins: [],
};
