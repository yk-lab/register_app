// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  runtimeConfig: {
    itemApiUrl: '',
    screenSaveImageApiUrl: '',
    public: {
      sentry: {
        dsn: '',
      }
    },
  },
  modules: [
    // "@sentry/nuxt/module",
    '@formkit/auto-animate/nuxt',
  ],
  css: ['~/assets/css/main.css'],
  sourcemap: {
    client: 'hidden'
  },
  // sentry: {
  //   autoInjectServerSentry: 'top-level-import',
  //   sourceMapsUploadOptions: {
  //     org: process.env.SENTRY_ORG,
  //     project: process.env.SENTRY_PROJECT,
  //     authToken: process.env.SENTRY_AUTH_TOKEN,
  //     sourcemaps: {
  //       filesToDeleteAfterUpload: [".*/**/*.map",],
  //     },
  //     telemetry: false,
  //   },
  // },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
