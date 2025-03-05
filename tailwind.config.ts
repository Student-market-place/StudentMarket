import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        main: "#EA5959",
        secondary: "hsl(var(--secondary))",
      },
    },
  },
  plugins: [],
};

export default config;
