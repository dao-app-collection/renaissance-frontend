const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "2.5rem",
      },
    },
    extend: {
      opacity: {
        0: "0",
        20: ".20",
        40: ".40",
        60: ".60",
        80: ".80",
        100: "1",
      },
      screens: {
        sm: "640px",
        // => @media (min-width: 640px) { ... }
        md: "768px",
        // => @media (min-width: 768px) { ... }
        lg: "1024px",
        // => @media (min-width: 1024px) { ... }
        xl: "1280px",
        // => @media (min-width: 1280px) { ... }
        "2xl": "1536px",
        // => @media (min-width: 1536px) { ... }
        "3xl": "2200px",
      },
      boxShadow: {
        card: "10px 10px 25px rgba(0, 0, 0, 0.03)",
        banner: "10px 10px 25px rgba(0, 0, 0, 0.09)",
        red: "0px 0px 20px rgba(190, 31, 62, 0.15)",
      },
      fontFamily: {
        sans: ["SF Pro Display", ...defaultTheme.fontFamily.sans],
      },
      letterSpacing: {
        "2%": "2%",
      },
      gridTemplateColumns: {
        layoutXL: "270px repeat(10, minmax(0, 1fr)) 270px",
        layoutSM: "230px repeat(10, minmax(0, 1fr)) 230px",
      },
      colors: {
        "bg-partnerships": "#787E8E",
        accents: {
          pink: "#9B3F97",
          blue: "#4880EE",
          green: "#45B26B",
          red: "#B24545",
        },
        beige: {
          100: "#FAF6F6",
        },
        orange: {
          300: "rgba(255,165,0, 0.25)",
          400: "rgba(255,165,0, 0.5)",
          500: "rgba(255,165,0, 0.75)",
          600: "rgba(255,165,0, 1)",
        },
        dark: {
          50: "#F1F1F1",
          75: "#A9A9A9",
          100: "#9D9D9D",
          200: "#979797",
          300: "#757575",
          400: "#605E5E",
          500: "#565656",
          600: "#535353",
          700: "#4E4E4E",
          800: "#4B4B4B",
          900: "#303030",
          1000: "#262626",
          1250: "#363944",
          1500: "#202020",
          1550: "#141416",
        },
        scheme: {
          100: "#787E8E",
          150: "#3E404A",
          200: "#2C2E36",
          250: "#2A2B32",
          300: "#24262E",
          500: "#18181C",
          600: "#19191D",
          bg: "#141416",
        },
        dark2: {
          100: "#E7E7E7",
          200: "#CACACA",
          300: "#A1A1A1",
          400: "#989898",
          800: "#2C2C2C",
        },
      },
      scale: {
        103: "1.03",
      },
    },
  },
  variants: {
    extend: {
      textColor: ["responsive", "hover", "focus", "group-hover"],
    },
  },
  // eslint-disable-next-line global-require
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
}
