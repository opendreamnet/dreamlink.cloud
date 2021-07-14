import Vue from 'vue'
import URI from 'urijs'
import { Record } from '@opendreamnet/ipfs'

import { downloadBlob } from '../modules/utils'

interface Data {
  /**
   * Instance with object information.
   */
  record: Record | null
  /**
   * URI instance of the first trusted gateway to have the object.
   */
  gatewayURI: URI | null
  /**
   * True if the object is being downloaded using the node.
   */
  nodeDownloadLoading: boolean
  _fetchTimeout: NodeJS.Timeout | null
}

export default Vue.extend({
  props: {
    cid: {
      type: String,
      required: true
    },
    filename: {
      type: String,
      default: null
    }
  },

  data: (): Data => ({
    record: null,
    gatewayURI: null,
    nodeDownloadLoading: false,
    _fetchTimeout: null
  }),

  created() {
    this.fetchRecord()
    this.$events.on(`${this.cid}.gateway.status`, this.onGatewayStatus)
  },

  beforeDestroy() {
    if (this._fetchTimeout) {
      clearTimeout(this._fetchTimeout)
    }

    this.$events.off(`${this.cid}.gateway.status`, this.onGatewayStatus)
  },

  methods: {
    /**
     * Try to fetch the record.
     */
    async fetchRecord() {
      if (this.record) {
        return
      }

      try {
        this.record = await this.$ipfs.add(this.cid, {
          name: this.filename,
          timeout: 300000 // 5 minutes
        })

        // Debug
        if (process.env.NODE_ENV !== 'production') {
          // @ts-ignore
          window.ipfsRecord = this.record
        }
      } catch(err) {
        // @ts-ignore
        console.warn(`[NetworkObject][${this.$options._componentTag}] Failed to fetch the record:`, err.message)
        this.$ipfs.remove(this.cid)

        if (this.$el) {
          // The page is still active, we can try again.
          this._fetchTimeout = setTimeout(this.fetchRecord.bind(this), 1000)
        }
      }
    },

    /**
     * Download the object using the IPFS node.
     */
    async nodeDownload() {
      if (!this.record || this.record.isDirectory || !this.record.file) {
        return
      }

      try {
        this.nodeDownloadLoading = true

        await this.record.file.downloadAsBlob(this.filename || this.cid)

        this.$events.emit('node.download')
      } catch (err ){
      } finally {
        this.nodeDownloadLoading = false
      }
    },

    onGatewayStatus(uri: URI) {
      if (!this.gatewayURI) {
        this.gatewayURI = uri
      }
    }
  }
})