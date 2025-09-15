import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        eco: {
          leaf: "hsl(var(--eco-leaf))",
          "leaf-light": "hsl(var(--eco-leaf-light))",
          growth: "hsl(var(--eco-growth))",
          "growth-light": "hsl(var(--eco-growth-light))",
          earth: "hsl(var(--eco-earth))",
          "earth-light": "hsl(var(--eco-earth-light))",
          water: "hsl(var(--eco-water))",
          "water-light": "hsl(var(--eco-water-light))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fall-leaf": {
          "0%": { 
            transform: "translateY(-20vh) rotate(0deg)", 
            opacity: "1" 
          },
          "100%": { 
            transform: "translateY(110vh) rotate(360deg)", 
            opacity: "0.4" 
          },
        },
        "fall-flower": {
          "0%": { 
            transform: "translateY(-20vh) rotate(0deg)", 
            opacity: "1" 
          },
          "100%": { 
            transform: "translateY(110vh) rotate(-360deg)", 
            opacity: "0.4" 
          },
        },
        "sway": {
          "0%": { transform: "rotate(-2deg)" },
          "50%": { transform: "scale(1.05) rotate(2deg)" },
          "100%": { transform: "rotate(-2deg)" },
        },
        "bounce-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "grow": {
          "0%": { transform: "scale(0.8)" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
        "sparkle": {
          "0%, 100%": { 
            transform: "scale(1) rotate(0deg)",
            opacity: "0.7"
          },
          "50%": { 
            transform: "scale(1.2) rotate(180deg)",
            opacity: "1"
          },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "popup": {
          "0%": { 
            transform: "translate(-50%, -50%) scale(0)", 
            opacity: "0" 
          },
          "30%": { 
            transform: "translate(-50%, -50%) scale(1.3)", 
            opacity: "1" 
          },
          "60%": { 
            transform: "translate(-50%, -50%) scale(1)", 
            opacity: "1" 
          },
          "100%": { 
            transform: "translate(-50%, -50%) scale(0)", 
            opacity: "0" 
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fall-leaf": "fall-leaf 15s linear infinite",
        "fall-flower": "fall-flower 18s linear infinite",
        "sway": "sway 3s ease-in-out infinite alternate",
        "bounce-soft": "bounce-soft 2s ease-in-out infinite",
        "grow": "grow 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "sparkle": "sparkle 2s ease-in-out infinite",
        "gradient-shift": "gradient-shift 20s ease infinite",
        "popup": "popup 1.5s ease forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
