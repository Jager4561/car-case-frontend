// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' },
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      titleTemplate: '%pageTitle %titleSeparator %siteName'
    }
  },
  build: {
    transpile: ['rxjs'],
  },
  imports: {
    dirs: ['composables/**'],
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  extends: ['nuxt-seo-kit'],
  modules: ['@nuxt/image-edge'],
  image: {
    dir: 'public',
    directus: {
      baseURL: process.env.ASSETS_URL + '/assets/'
    }
  },
  nitro: {
    compressPublicAssets: {
      gzip: true,
      brotli: true,
    },
  },
  css: [
    '@/assets/css/main.scss',
    '@/assets/css/fonts.scss',
    '@/assets/css/inputs.scss',
    '@/assets/css/animations.scss',
  ],
  runtimeConfig: {
    public: {
      appVersion: '1.0.0',
      apiUrl: process.env.API_URL,
      assetsUrl: process.env.ASSETS_URL,
      siteUrl: 'https://carcase.codeu.io',
      siteName: 'CarCase',
      siteDescription: 'CarCase to serwis służacy do przechowywania oraz publikowania dokumentacji technicznej samochodów, tworzą ją wszyscy użytownicy serwisu. Dołącz do nich już dziś!',
      language: 'pl-PL',
      titleSeparator: '•'
    }
  }
});
