/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FAF7F2",
        ink: "#2D2A26",
        sage: {
          50: "#EEF2EF",
          100: "#DCE6E0",
          300: "#9FB8AB",
          500: "#5B7A6B",
          600: "#4A6657",
          700: "#3A5145",
        },
        clay: {
          50: "#FBEDE7",
          100: "#F5D6C9",
          300: "#E0A48C",
          500: "#C8745C",
          600: "#B05F49",
          700: "#8F4B39",
        },
        sand: {
          100: "#F1EAD9",
          200: "#E8DFD0",
          300: "#DCD0BB",
        },
        stone: {
          400: "#8B8378",
          500: "#766F64",
          600: "#5C564C",
        },
        sky: {
          50: "#EAF3F8",
          100: "#D2E7F0",
          300: "#8FC4DC",
          500: "#3E92B8",
          600: "#2F7494",
          700: "#235A73",
        },
        sun: {
          50: "#FEF6E3",
          100: "#FCE7B8",
          300: "#F7C667",
          500: "#EFA22B",
          600: "#C9821C",
        },
        coral: {
          100: "#FDE8E8",
          200: "#F9C5C5",
          300: "#F3A0A0",
          400: "#E97676",
          500: "#D94A4A",
          600: "#B83A3A",
          700: "#962E2E",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "20px",
      },
      boxShadow: {
        soft: "0 2px 14px rgba(45, 42, 38, 0.06)",
        clay: "0 8px 24px rgba(45, 42, 38, 0.08), 0 -4px 12px rgba(255, 255, 255, 0.7)",
        "clay-lg": "0 12px 36px rgba(45, 42, 38, 0.1), 0 -4px 16px rgba(255, 255, 255, 0.8)",
        "clay-btn": "0 4px 12px rgba(45, 42, 38, 0.06), 0 -2px 6px rgba(255, 255, 255, 0.5)",
        "clay-inset": "inset 0 2px 4px rgba(45, 42, 38, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
      },
      spacing: {
        4.5: "1.125rem",
      },
    },
  },
  plugins: [],
};
