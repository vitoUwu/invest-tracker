import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  content: [
    "docs/content/**/*.md",
    "docs/**/*.{vue,js,ts,jsx,tsx}",
    "pages/**/*.vue",
    "components/**/*.vue",
    "layouts/**/*.vue",
    "server/**/*.ts",
    "app.vue",
  ],
};
