import Vue from 'vue'
import { Plugin } from '@nuxt/types'
import { storage } from '../modules/storage'
import { ipfs } from '../modules/ipfs'

const plugin: Plugin = async(ctx, inject) => {
  inject('ipfs', Vue.observable(ipfs))

  storage.init()
  inject('storage', Vue.observable(storage))

  if (process.env.NODE_ENV !== 'production') {
    // @ts-ignore
    window.ipfs = ipfs
  }
}

export default plugin