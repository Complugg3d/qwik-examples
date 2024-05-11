/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      animation: {
        scaleIn: "scaleIn 300ms ease-in-out",
        scaleOut: "scaleOut 300ms ease-out",
      },
    },
  },
  plugins: ["@tailwindcss/forms"],
};
