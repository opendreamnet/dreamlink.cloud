import { IPFS } from '@opendreamnet/ipfs'
import EventEmitter from 'events'
import { DateTime } from 'luxon'
import BigInt from 'jsbi'
import { accessorType } from '~/store'
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

  interface NuxtAppOptions {
    $accessor: typeof accessorType
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $ipfs: IPFS
    $storage: Storage
    $bus: EventEmitter
    $settings: Settings
  }

  interface Vue {
    $accessor: typeof accessorType
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

declare global {
  interface Window { 
    ipfs?: IPFS
    BigInt?: BigInt
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