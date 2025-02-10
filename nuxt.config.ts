// https://tailwindcss.com/docs/installation/framework-guides/nuxt
import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config
import webpackStatsPlugin from "rollup-plugin-webpack-stats";

export default defineNuxtConfig({
	ssr: false,
	compatibilityDate: "2024-04-03",
	devtools: { enabled: true },
	runtimeConfig: {
		itemApiUrl: "",
		screenSaveImageApiUrl: "",
		originalPrepaidPaymentApiKey: "",
		public: {
			sentry: {
				dsn: "",
			},
			originalPrepaidPayment: {
				url: "",
				name: "",
			},
		},
	},
	modules: [
		// "@sentry/nuxt/module",
		"@formkit/auto-animate/nuxt",
	],
	css: ["~/assets/css/main.css"],
	sourcemap: {
		client: "hidden",
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
	vite: {
		plugins: [
			// Output webpack-stats.json file
			// https://relative-ci.com/documentation/guides/bundle-stats/vite
			webpackStatsPlugin(),
			// https://tailwindcss.com/docs/installation/framework-guides/nuxt
			tailwindcss(),
		],
	},
});
