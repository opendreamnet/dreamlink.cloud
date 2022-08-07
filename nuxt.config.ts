import { setNuxtConfig } from '@opendreamnet/nuxtjs-base'
import { isNil } from 'lodash'
import pkg from './package.json'

// Base env
process.env.npm_package_name = pkg.name
process.env.npm_package_displayName = pkg.displayName
process.env.npm_package_description = pkg.description
process.env.npm_package_version = pkg.version

export default setNuxtConfig({
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    script: [
      {
        // The latest IPFS-JS libraries are now ESM forcing us to use the
        // @opendreamnet/ipfs version built with Webpack 5. (This NuxtJS v2 uses Webpack 4)
        // We still include the library to use the types.
        src: 'https://unpkg.com/@opendreamnet/ipfs@0.1.4/dist/index.umd.js'
      }
    ]
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
    '~/plugins/ipfs.ts',
    '~/plugins/vue-modal.ts'
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
    '@nuxt/content'
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
        'faCaretDown',
        'faThumbtack'
      ]
    }
  },

  // https://github.com/nuxt-community/google-fonts-module
  googleFonts: {
    download: process.env.NODE_ENV === 'production' && !isNil(process.env.OPENDREAMNET),
    families: {
      Inter: [300, 400, 600, 800]
    }
  },

  pwa: {
    workbox: {
      enabled: false
    }
  },

  publicRuntimeConfig: {
    build: {
      opendreamnet: !isNil(process.env.OPENDREAMNET)
    },
    app: {
      url: process.env.APP_URL,
      urlCid: process.env.APP_URL_CID || process.env.APP_URL,
      githubUrl: process.env.APP_GITHUB_URL
    },
    company: {
      name: process.env.COMPANY_NAME || 'Iván Bravo Bravo',
      logo: process.env.COMPANY_LOGO,
      url: process.env.COMPANY_URL || 'mailto:kolessios@gmail.com'
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // Customize Babel configuration for JavaScript and Vue files.
    babel: {
      // @ts-ignore
      presets(env, defaultPreset) {
        // @ts-ignore
        defaultPreset[1].targets = {}
      },
      plugins: [
        'lodash',
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-proposal-optional-chaining'
      ]
    }
  }
})
