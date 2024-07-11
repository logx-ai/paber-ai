import type { Config } from "tailwindcss";
const svgToDataUri = require("mini-svg-data-uri");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

const config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./supabase/**/*.{js,ts,jsx,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    languages: ["ar", "en"],
    extend: {
      colors: {
        main: "#256BAB",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  extend: {
    backgroundImage: (theme: any) => ({
      squiggle: `url("${svgToDataUri(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 3" enable-background="new 0 0 6 3" width="6" height="3" fill="${theme(
          "colors.yellow.400",
        )}"><polygon points="5.5,0 2.5,3 1.1,3 4.1,0"/><polygon points="4,0 6,2 6,0.6 5.4,0"/><polygon points="0,2 1,3 2.4,3 0,0.6"/></svg>`,
      )}")`,
    }),
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@gloriousky/tailwindcss-localization"),

    ({ matchUtilities, theme }: any) => {
      matchUtilities(
        {
          "bg-grid": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg width="32" height="31" viewBox="0 0 32 31" fill="none" stroke="${value}" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_3738_40)">
                  <path d="M0 15.5H31.5" stroke="${value}"/>
                  <path d="M31.5 0V16" stroke="${value}"/>
                  <path d="M31.5 15V31" stroke="${value}"/>
                </g>
                <defs>
                  <clipPath id="clip0_3738_40">
                    <rect width="32" height="31" fill="white"/>
                  </clipPath>
                </defs>
              </svg>`,
            )}")`,
          }),
        },
        {
          values: flattenColorPalette(theme("backgroundColor")),
          type: "color",
        },
      );

      matchUtilities(
        {
          highlight: (value: any) => ({
            boxShadow: `inset 0 1px 0 0 ${value}`,
          }),
        },
        {
          values: flattenColorPalette(theme("backgroundColor")),
          type: "color",
        },
      );
    },

    ({ addUtilities, theme }: any) => {
      let backgroundSize = "7.07px 7.07px";
      let backgroundImage = (color: any) =>
        `linear-gradient(135deg, ${color} 10%, transparent 10%, transparent 50%, ${color} 50%, ${color} 60%, transparent 60%, transparent 100%)`;
      let colors = Object.entries(theme("backgroundColor")).filter(
        ([, value]: any) =>
          typeof value === "object" && value[400] && value[500],
      );

      addUtilities(
        Object.fromEntries(
          colors.map(([name, colors]: any) => {
            let backgroundColor = colors[400] + "1a"; // 10% opacity
            let stripeColor = colors[500] + "80"; // 50% opacity

            return [
              `.bg-stripes-${name}`,
              {
                backgroundColor,
                backgroundImage: backgroundImage(stripeColor),
                backgroundSize,
              },
            ];
          }),
        ),
      );

      addUtilities({
        ".bg-stripes-white": {
          backgroundImage: backgroundImage("rgba(255 255 255 / 0.75)"),
          backgroundSize,
        },
      });

      addUtilities({
        ".ligatures-none": {
          fontVariantLigatures: "none",
        },
      });
    },
  ],
} satisfies Config;

export default config;
