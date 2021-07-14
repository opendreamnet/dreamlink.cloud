import { getAccessorType } from 'typed-vuex'
import * as pins from './pins'
import * as ipfs from './ipfs'
import * as settings from './settings'

export const accessorType = getAccessorType({
  modules: {
    // The key (submodule) needs to match the Nuxt namespace (e.g. ~/store/submodule.ts)
    pins,
    ipfs,
    settings
  }
})