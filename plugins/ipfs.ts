import Vue from 'vue'
import { Plugin } from '@nuxt/types'
import { IPFS } from '@opendreamnet/ipfs'
import { storage } from '../modules/storage'
import { ipfs } from '../modules/ipfs'

const plugin: Plugin = async(ctx, inject) => {
  inject('ipfs', Vue.observable(ipfs))
  
  await storage.init()
  inject('storage', Vue.observable(storage))

  // @ts-ignore
  window.ipfs = ipfs
}

export default plugin