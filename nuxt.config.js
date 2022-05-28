const path = require('path')
const { setNuxtConfig } = require('@opendreamnet/nuxtjs-base')
const pkg = require('./package.json')

process.env.npm_package_name = pkg.name
process.env.npm_package_description = pkg.description
process.env.npm_package_displayName = pkg.displayName
process.env.npm_package_version = pkg.version

export default setNuxtConfig({
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
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
    require.resolve('@opendreamnet/nuxtjs-base/plugins/boot.ts'),
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
    // https://github.com/nuxt-community/google-fonts-module
    '@nuxtjs/google-fonts',
    // https://image.nuxtjs.org/
    // '@nuxt/image',
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
    // ! Use v2.3.2: https://github.com/nuxt-community/gtm-module/issues/118
    '@nuxtjs/gtm'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [
    path.resolve(__dirname, 'node_modules/@opendreamnet/nuxtjs-base/components'),
    '~/components'
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
        'faHeart',
        'faHeartBroken',
        'faDatabase',
        'faCaretDown'
      ]
    }
  },

  googleFonts: {
    download: process.env.NODE_ENV === 'production',
    families: {
      Inter: [300, 400, 600, 800]
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

    transpile: ['@opendreamnet/ipfs', '@opendreamnet/app'],

    extend(config) {
      config.resolve.alias['@opendreamnet/ipfs'] = path.resolve('./node_modules/@opendreamnet/ipfs/src/index.ts')
    }
  }
})