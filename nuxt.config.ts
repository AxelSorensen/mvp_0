// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,
  },
  nitro: {
    vercel: {
      functions: {
        maxDuration: 60,
      },
    },
  },
  modules: ['nuxt-icon'],
  css: ['/globals.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})