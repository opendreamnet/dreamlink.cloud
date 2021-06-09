import { isNil } from 'lodash'
import prettyBytes from 'pretty-bytes'
import { bus } from './bus'
import { ipfs } from './ipfs'

const REQUESTED_QUOTA = 100*1024*1024*1024 // 100 GB

export class Storage {
  public isChrome = false

  public quota: number | null = null
  
  public usage: number | null = null

  public async init() {
    this.isChrome = this.checkChrome()

    if (!await navigator.storage.persisted()) {
      await navigator.storage.persist()
    }

    ipfs.on('ready', this.check.bind(this))
    bus.on('upload.success', this.check.bind(this))
    bus.on('node.gc', this.check.bind(this))
    bus.on('node.download', this.check.bind(this))
  }

  /*
  public async requestQuota() {
    if (this.isChrome) {
      // @ts-ignore
      navigator.webkitPersistentStorage.requestQuota(REQUESTED_QUOTA, (bytes: number) => {
        console.log('[Storage] The web browser has given us a storage of', prettyBytes(bytes))

        this.quota = bytes
    
        // @ts-ignore
        window.webkitRequestFileSystem(window.PERSISTENT, bytes, () => { }, (err: Error) => console.warn('[Storage]', err))
      }, (err: Error) => console.warn('[Storage]', err))
    }
  }
  */

  public async check(): Promise<void> {
    const estimation = await this.getEstimation()

    this.quota = estimation.quota || null
    this.usage = estimation.usage || null
  }

  public async getEstimation(): Promise<StorageEstimate> {
    const estimation: StorageEstimate = {}

    try {
      estimation.usage = Number((await ipfs.api.repo.stat()).repoSize)
    } catch (err) {
      estimation.usage = undefined
    }

    if (this.isChrome) {
      await new Promise((resolve, reject) => {
        // @ts-ignore
          navigator.webkitPersistentStorage.queryUsageAndQuota(
            (usedBytes: number, grantedBytes: number) => {
            estimation.quota = grantedBytes

            if (!estimation.usage) {
              estimation.usage = usedBytes
            }

            resolve(estimation)
          },
          (err: Error) => reject(err)
        )
      })
    }
    
    if (!estimation.quota) {
      const est = await navigator.storage.estimate()

      estimation.quota = est.quota

      if (!estimation.usage) {
        estimation.usage = est.usage
      }
    }

    return estimation
  }

  protected checkChrome() {
    // @ts-ignore
    return !isNil(navigator.webkitPersistentStorage)
  }
}

export const storage = new Storage()