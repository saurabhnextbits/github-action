import colors from 'vuetify/es5/util/colors'
require('dotenv').config()
// console.log(process.env)

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - vue-admin-app',
    title: 'vue-admin-app',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  router: {
    middleware: ['auth']
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/dotenv',
  '@nuxtclub/supabase',
  '@pnodev/nuxt-directus',
  'cookie-universal-nuxt',
  ],
  directus: {
    apiUrl: 'https://5mee2e5z.directus.app', // your API URL
    accessTokenCookieName: 'directus_access_token', // the name of the cookie the access_token will be saved in
    refreshTokenCookieName: 'directus_refresh_token', // the name of the cookie the refresh_token will be saved in
    loginRoute: '/auth/signin', // the route containing your login-form
    homeRoute: '/?login=true', // the route the user will be redirected to after authentication
    hideLoginWhenAuthenticated: true, // when set to true, authenticated users will be redirected to homeRoute, when accessing loginRoute
  },
  supabase: {
    url: 'https://lgxmgisedaoosyiddqtl.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxneG1naXNlZGFvb3N5aWRkcXRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDY3MTk0OTYsImV4cCI6MTk2MjI5NTQ5Nn0.Xs_TILh-3ulUxlnEr440eyqTCeEXItJxsqsXx5NSiqI',
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.orange.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        light: {
          primary: colors.orange.darken2,
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
