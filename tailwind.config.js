/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "360px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "3xl": "1920px",
        // Breakpoints específicos para dispositivos
        "mobile-s": "320px",
        "mobile-m": "375px",
        "mobile-l": "425px",
        tablet: "768px",
        laptop: "1024px",
        "laptop-l": "1440px",
        desktop: "2560px",
        // Breakpoints para orientação
        portrait: { raw: "(orientation: portrait)" },
        landscape: { raw: "(orientation: landscape)" },
        // Breakpoints para altura
        "h-sm": { raw: "(max-height: 600px)" },
        "h-md": { raw: "(min-height: 601px) and (max-height: 800px)" },
        "h-lg": { raw: "(min-height: 801px)" },
      },
      colors: {
        // Cores baseadas no logo
        primary: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
          950: "#450A0A",
        },
        secondary: {
          50: "#F7FEE7",
          100: "#ECFCCB",
          200: "#D9F99D",
          300: "#BEF264",
          400: "#A3E635",
          500: "#84CC16",
          600: "#65A30D",
          700: "#4D7C0F",
          800: "#365314",
          900: "#1A2E05",
          950: "#0F1B02",
        },
        accent: {
          red: "#FEE2E2",
          green: "#F0FDF4",
        },
        neutral: {
          warm: "#F5F5F4",
          cool: "#F8FAFC",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
        // Tamanhos fluidos para responsividade
        "fluid-xs": "clamp(0.75rem, 1.5vw, 0.875rem)",
        "fluid-sm": "clamp(0.875rem, 2vw, 1rem)",
        "fluid-base": "clamp(1rem, 2.5vw, 1.125rem)",
        "fluid-lg": "clamp(1.125rem, 3vw, 1.25rem)",
        "fluid-xl": "clamp(1.25rem, 3.5vw, 1.5rem)",
        "fluid-2xl": "clamp(1.5rem, 4vw, 2rem)",
        "fluid-3xl": "clamp(1.875rem, 5vw, 2.5rem)",
        "fluid-4xl": "clamp(2.25rem, 6vw, 3rem)",
        "fluid-5xl": "clamp(3rem, 7vw, 4rem)",
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
        144: "36rem",
        // Espaçamentos fluidos
        "fluid-1": "clamp(0.25rem, 1vw, 0.5rem)",
        "fluid-2": "clamp(0.5rem, 2vw, 1rem)",
        "fluid-4": "clamp(1rem, 3vw, 2rem)",
        "fluid-8": "clamp(2rem, 4vw, 4rem)",
        "fluid-16": "clamp(4rem, 6vw, 8rem)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #FEE2E2 0%, #F8FAFC 100%)",
        "gradient-secondary": "linear-gradient(135deg, #F0FDF4 0%, #F8FAFC 100%)",
        "gradient-hero": "linear-gradient(135deg, #FEE2E2 0%, #ECFCCB 50%, #F8FAFC 100%)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "bounce-gentle": "bounceGentle 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      aspectRatio: {
        "4/3": "4 / 3",
        "3/2": "3 / 2",
        "2/3": "2 / 3",
        "9/16": "9 / 16",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
      minHeight: {
        "screen-75": "75vh",
        "screen-50": "50vh",
        "screen-25": "25vh",
      },
      zIndex: {
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
      },
    },
  },
  plugins: [
    // Plugin para adicionar utilitários de container responsivo
    ({ addUtilities, theme }) => {
      const newUtilities = {
        ".container-fluid": {
          width: "100%",
          paddingLeft: theme("spacing.4"),
          paddingRight: theme("spacing.4"),
          "@screen sm": {
            paddingLeft: theme("spacing.6"),
            paddingRight: theme("spacing.6"),
          },
          "@screen lg": {
            paddingLeft: theme("spacing.8"),
            paddingRight: theme("spacing.8"),
          },
        },
        ".safe-area-top": {
          paddingTop: "env(safe-area-inset-top)",
        },
        ".safe-area-bottom": {
          paddingBottom: "env(safe-area-inset-bottom)",
        },
        ".safe-area-left": {
          paddingLeft: "env(safe-area-inset-left)",
        },
        ".safe-area-right": {
          paddingRight: "env(safe-area-inset-right)",
        },
      }
      addUtilities(newUtilities)
    },
  ],
}
