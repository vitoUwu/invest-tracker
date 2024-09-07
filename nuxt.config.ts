// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "nuxt-mongoose"],
  tailwindcss: {
    configPath: "./tailwind.config.ts",
  },
  colorMode: {
    preference: "dark",
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
});