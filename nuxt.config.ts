// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  runtimeConfig: {
    itemApiUrl: '',
    public: {
      sentry: {
        dsn: '',
      }
    },
  },
  modules: ["@sentry/nuxt/module", '@formkit/auto-animate/nuxt'],
  css: ['~/assets/css/main.css'],
  sourcemap: { client: true },
  sentry: {
    sourceMapsUploadOptions: {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
    },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
