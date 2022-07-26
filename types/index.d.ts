import type * as OIPFS from '@opendreamnet/ipfs'
import EventEmitter from 'events'
import { DateTime } from 'luxon'
import BigInt from 'jsbi'
import { accessorType } from '~/store'
import { Storage } from '~/modules/storage'

declare module '@nuxt/types' {
  interface Context {
    $ipfs: OIPFS.IPFS
    $storage: Storage
    $events: EventEmitter
  }

  interface NuxtAppOptions {
    $ipfs: OIPFS.IPFS
    $storage: Storage
    $events: EventEmitter
  }

  interface NuxtAppOptions {
    $accessor: typeof accessorType
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $ipfs: OIPFS.IPFS
    $storage: Storage
    $events: EventEmitter
  }

  interface Vue {
    $accessor: typeof accessorType
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $ipfs: OIPFS.IPFS
    $storage: Storage
    $events: EventEmitter
  }
}

declare global {
  interface Window {
    IPFS: typeof OIPFS.IPFS 
    PrivateKey: typeof OIPFS.PrivateKey
    PublicKey: typeof OIPFS.PublicKey
    Entry: typeof OIPFS.Entry

    ipfs?: OIPFS.IPFS
    BigInt?: BigInt
  }

  class IPFS extends OIPFS.IPFS { }
  class PrivateKey extends OIPFS.PrivateKey { }
  class PublicKey extends OIPFS.PublicKey { } 
  class Entry extends OIPFS.Entry { }

  //const IPFS: typeof OIPFS.IPFS
  //const PrivateKey: typeof OIPFS.PrivateKey
  //const PublicKey: typeof OIPFS.PublicKey
  //const Entry: typeof OIPFS.Entry

  //type IPFS: typeof IPFS 
  //const PrivateKey: typeof PrivateKey
  //PublicKey: typeof PublicKey
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