import { IPFS } from '@opendreamnet/ipfs'
import EventEmitter from 'events'
import { DateTime } from 'luxon'
import BigInt from 'jsbi'
import { accessorType } from '~/store'
import { Storage } from '~/modules/storage'

declare module '@nuxt/types' {
  interface Context {
    $ipfs: IPFS
    $storage: Storage
    $events: EventEmitter
  }

  interface NuxtAppOptions {
    $ipfs: IPFS
    $storage: Storage
    $events: EventEmitter
  }

  interface NuxtAppOptions {
    $accessor: typeof accessorType
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $ipfs: IPFS
    $storage: Storage
    $events: EventEmitter
  }

  interface Vue {
    $accessor: typeof accessorType
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $ipfs: IPFS
    $storage: Storage
    $events: EventEmitter
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