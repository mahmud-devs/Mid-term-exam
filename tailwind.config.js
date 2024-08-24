/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        full: "100vh",
      },
    },
    // -----------color-----------------
    colors: {
      darkBlue: "#11175D",
      customBlack: "#000",
      btnColor: "#5F35F5",
      white: "#fff",
      textColor: "#03014C",
      ptext: "#4D4D4D",
      blueRgb: "linear-gradient( #62cff4, #2c67f2)",
    },
    fontFamily: {
      open: ["Open Sans", "sans-serif"],
      nunito: ["Nunito", "sans-serif"],
      popin: ["Poppins", "sans-serif"],
    },
  },
  plugins: [
    // ...
    require('tailwind-scrollbar'),
  ],
};
