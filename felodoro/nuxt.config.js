const colors = require("vuetify/es5/util/colors").default;

module.exports = {
  mode: "spa",
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: "%s - " + process.env.npm_package_name,
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
      // { name: 'apple-mobile-web-app-capable', content: 'yes'},
      // { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent'},
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "favicon.ico" },
      { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#5bbad5" },
      {
        rel: "apple-touch-startup-image",
        href: "/splash/launch-640x1136.png",
        media:
          "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      },
      {
        rel: "apple-touch-startup-image",
        href: "/splash/launch-750x1294.png",
        media:
          "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      },
      {
        rel: "apple-touch-startup-image",
        href: "/splash/launch-1242x2148.png",
        media:
          "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
      },
      {
        rel: "apple-touch-startup-image",
        href: "/splash/launch-1125x2436.png",
        media:
          "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
      },
      {
        rel: "apple-touch-startup-image",
        href: "/splash/launch-1536x2048.png",
        media:
          "(min-device-width: 768px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)"
      },
      {
        rel: "apple-touch-startup-image",
        href: "/splash/launch-1668x2224.png",
        media:
          "(min-device-width: 834px) and (max-device-width: 834px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)"
      },
      {
        rel: "apple-touch-startup-image",
        href: "/splash/launch-2048x2732.png",
        media:
          "(min-device-width: 1024px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)"
      }
      // { rel: 'manifest', href: '/manifest.json'},
    ]
  },

  pwa: {
    meta: {
      mobileAppIOS: true
    }
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ["@nuxtjs/vuetify"],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    // "@nuxtjs/onesignal",
    "@nuxtjs/axios",
    "@nuxtjs/pwa"
  ],

  /*
   **One Signal configuration
   */
  // oneSignal: {
  //   cdn: true,
  //   init: {
  //     appId: "3d5778a7-192e-45fb-ac53-45e3e4d46780",
  //     allowLocalhostAsSecureOrigin: true
  //     // welcomeNotification: {
  //     //   disable: false
  //     // }
  //   }
  // },

  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    proxyHeaders: false,
    credentials: false
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
};
