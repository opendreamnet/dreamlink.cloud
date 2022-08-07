import Vue from 'vue'
import { Plugin } from '@nuxt/types'
import { noop } from 'lodash'
import { storage } from '../modules/storage'
import { ipfs } from '../modules/ipfs'

window.global = window

const plugin: Plugin = async({ app, $config }, inject) => {
  // Inject ipfs into context
  inject('ipfs', Vue.observable(ipfs))

  // Fetch and set the app settings.
  await app.$accessor.settings.setup()

  // Set node settings and start it.
  app.$accessor.ipfs.start().then(() => {
    if ($config.app.urlCid) {
      // Fetch application CID
      app.$accessor.ipfs.fetchAppCID($config.app.urlCid)
    }
  })

  // Fetch the list of pinned objects.
  app.$accessor.pins.fetch()

  // Storage information.
  storage.init()
  inject('storage', Vue.observable(storage))

  // Debug
  if (process.env.NODE_ENV !== 'production') {
    window.ipfs = ipfs
  }
}

export default plugin
