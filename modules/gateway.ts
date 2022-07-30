import axios, { AxiosRequestConfig } from 'axios'
import { noop } from 'lodash'
import URI from 'urijs'
import pRetry, { AbortError } from 'p-retry'
import gateways from '~/modules/gateways.json'

export class Gateway {
  public static fromFirst(cid: string, name?: string | null) {
    return new this(gateways[0], cid, name)
  }

  public static fromAll(cid: string, name?: string | null): Gateway[] {
    return gateways.map(url => new this(url, cid, name))
  }

  public static isStoredOnFirst(cid: string, onlyIfCached = false, timeout = 15 * 1000) {
    const gateway = Gateway.fromFirst(cid)
    return gateway.isStored(onlyIfCached, timeout)
  }

  protected controller = new AbortController()

  // eslint-disable-next-line no-useless-constructor
  constructor(public gatewayURL: string, public cid: string, public name?: string | null) {

  }

  public get shareURI(): URI {
    const uri = new URI(this.gatewayURL).directory('ipfs').filename(this.cid)

    if (this.name) {
      uri.query({ filename: this.name })
    }

    return uri
  }

  public getShareURL(download = false): string {
    let uri = this.shareURI

    if (download) {
      uri = uri.query({ download: download ? 'true' : 'false' })
    }

    return uri.href()
  }

  public async isStored(onlyIfCached = false, timeout = 15 * 1000): Promise<boolean> {
    try {
      const config: AxiosRequestConfig = {
        timeout
      }

      if (onlyIfCached) {
        // https://github.com/ipfs/specs/blob/main/http-gateways/PATH_GATEWAY.md#only-if-cached-head-behavior
        config.headers = {
          'Cache-Control': 'only-if-cached'
        }
      }

      await axios.head(this.getShareURL(), config)

      return true
    } catch (err: any) {
      return false
    }
  }

  public async untilAvailable(): Promise<boolean> {
    /*
    const firstResponse = await this.isStored()

    if (firstResponse) {
      return true
    }
    */

    try {
      await pRetry(async() => {
        const response = await this.isStored()

        if (!response) {
          throw new Error('Not stored.')
        }
      }, {
        forever: true,
        minTimeout: 2 * 1000,
        maxTimeout: 15 * 1000,
        factor: 1.5,
        signal: this.controller.signal
      })
    } catch (err: any) {
      return false
    }

    return true
  }

  public abortCheck() {
    this.controller.abort()
  }
}
