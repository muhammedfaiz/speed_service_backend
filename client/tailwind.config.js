/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // legacy tokens — still referenced by not-yet-restyled pages, keep until full migration
        "primary-blue": "#1C77C3",
        "secondary-blue": "#2191EC",
        black: "#0D1B1E",

        primary: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          DEFAULT: "#2563EB",
        },
        secondary: {
          50: "#F0F9FF",
          100: "#E0F2FE",
          500: "#0EA5E9",
          600: "#0284C7",
          DEFAULT: "#0EA5E9",
        },
        accent: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D",
          DEFAULT: "#22C55E",
        },
        surface: "#F8FAFC",
        card: "#FFFFFF",
        fg: {
          DEFAULT: "#0F172A",
          muted: "#64748B",
          subtle: "#94A3B8",
        },
      },
      fontFamily: {
        display: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
      },
      boxShadow: {
        soft: "0 2px 8px 0 rgb(15 23 42 / 0.06), 0 1px 2px 0 rgb(15 23 42 / 0.04)",
        elevated: "0 12px 32px -8px rgb(15 23 42 / 0.18)",
        glass: "0 8px 32px 0 rgb(15 23 42 / 0.08)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        blob: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -40px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        blob: "blob 14s infinite ease-in-out",
        "blob-delay": "blob 14s infinite ease-in-out 4s",
        shimmer: "shimmer 1.8s infinite linear",
      },
    },
  },
  plugins: [],
};
