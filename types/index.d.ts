import { IPFS } from '@opendreamnet/ipfs'
import EventEmitter from 'events'
import { DateTime } from 'luxon'
import { Storage } from '~/modules/storage'
import { Settings } from '~/modules/settings'

declare module '@nuxt/types' {
  interface Context {
    $ipfs: IPFS
    $storage: Storage
    $bus: EventEmitter
    $settings: Settings
  }

  interface NuxtAppOptions {
    $ipfs: IPFS
    $storage: Storage
    $bus: EventEmitter
    $settings: Settings
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $ipfs: IPFS
    $storage: Storage
    $bus: EventEmitter
    $settings: Settings
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $ipfs: IPFS
    $storage: Storage
    $bus: EventEmitter
    $settings: Settings
  }
}

interface Message {
  username: string
  message: string
  content?: string
  iv: string
  salt: string
  seed: string
}

export interface ChatRecord {
  from: string
  date: DateTime
  data: string
}