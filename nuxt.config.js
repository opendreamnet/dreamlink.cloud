const { setNuxtConfig } = require('@opendreamnet/nuxtjs-base')
const pkg = require('./package.json')

process.env.npm_package_name = pkg.name
process.env.npm_package_displayName = pkg.displayName
process.env.npm_package_version = pkg.version

export default setNuxtConfig({
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'dialog-polyfill/dialog-polyfill.css',

    '@opendreamnet/nuxtjs-base/assets/css/reset.scss',
    '@opendreamnet/nuxtjs-base/assets/css/input.scss',
    '@opendreamnet/nuxtjs-base/assets/css/checkbox.scss',

    'tippy.js/dist/tippy.css',
    'mooviejs/css/moovie.css',

    'highlight.js/styles/default.css',
    'highlight.js/styles/atom-one-dark.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    'node_modules/@opendreamnet/nuxtjs-base/plugins/boot.ts',
    '~/plugins/boot.ts',
    '~/plugins/ipfs.ts'
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    // https://github.com/nuxt-community/style-resources-module
    '@nuxtjs/style-resources',
    // https://github.com/nuxt-community/fontawesome-module
    '@nuxtjs/fontawesome',
    // https://image.nuxtjs.org/
    '@nuxt/image',
    // https://github.com/nuxt-community/markdownit-module
    '@nuxtjs/markdownit',
    // https://typed-vuex.roe.dev/
    'nuxt-typed-vuex'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    // https://github.com/nuxt-community/gtm-module
    '@nuxtjs/gtm'
  ],

  // https://github.com/nuxt-community/fontawesome-module
  fontawesome: {
    icons: {
      solid: [
        'faDownload',
        'faUpload',
        'faExternalLinkSquareAlt',
        'faQuestion',
        'faQuestionCircle',
        'faShare',
        'faClone',
        'faFolderOpen',
        'faBook',
        'faDirections',
        'faSave',
        'faExclamationTriangle',
        'faUsers',
        'faComments',
        'faCog',
        'faSpinner',
        'faFileVideo',
        'faFileAudio',
        'faFileImage',
        'faFileAlt',
        'faFilePdf',
        'faFolder',
        'faTrashAlt',
        'faStar',
        'faDatabase'
      ]
    }
  },

  publicRuntimeConfig: {
    // https://github.com/nuxt-community/gtm-module
    // Used for basic analytics and displaying the coookie consent alert.
    gtm: {
      id: process.env.GOOGLE_TAG_MANAGER_ID
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // Customize Babel configuration for JavaScript and Vue files.
    babel: {
      plugins: [
        'lodash',
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-proposal-optional-chaining'
      ]
    },

    transpile: ['ipfs-core', '@opendreamnet/ipfs', '@opendreamnet/app']
  }
})