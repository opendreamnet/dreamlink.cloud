import { IPFS } from '@opendreamnet/ipfs'
import EventEmitter from 'events'
import { Storage } from '~/modules/storage'

declare module '@nuxt/types' {
  interface Context {
    $ipfs: IPFS
    $storage: Storage
    $bus: EventEmitter
  }

  interface NuxtAppOptions {
    $ipfs: IPFS
    $storage: Storage
    $bus: EventEmitter
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $ipfs: IPFS
    $storage: Storage
    $bus: EventEmitter
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $ipfs: IPFS
    $storage: Storage
    $bus: EventEmitter
  }
}