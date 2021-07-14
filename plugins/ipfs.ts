import Vue from 'vue'
import { Plugin } from '@nuxt/types'
import { storage } from '../modules/storage'
import { ipfs } from '../modules/ipfs'

const plugin: Plugin = async({ app }, inject) => {
  // Fetch and set the app settings.
  await app.$accessor.settings.setup()

  // Set node settings and start it.
  app.$accessor.ipfs.start()

  // Fetch the list of pinned objects.
  app.$accessor.pins.fetch()

  // Storage information.
  storage.init()

  inject('ipfs', Vue.observable(ipfs))
  inject('storage', Vue.observable(storage))

  // Debug
  if (process.env.NODE_ENV !== 'production') {
    window.ipfs = ipfs
  }
}

export default plugin