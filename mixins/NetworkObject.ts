import Vue from 'vue'
import URI from 'urijs'
import { Record } from '@opendreamnet/ipfs'

import { downloadBlob } from '../modules/utils'

interface Data {
  record: Record | null
  gatewayURI: URI | null
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
    this.$bus.on(`${this.cid}.gateway.status`, this.onGatewayStatus)
  },

  beforeDestroy() {
    if (this._fetchTimeout) {
      clearTimeout(this._fetchTimeout)
    }

    this.$bus.off(`${this.cid}.gateway.status`, this.onGatewayStatus)
  },

  methods: {
    /**
     * Try to fetch the record with the information from the IPFS object.
     */
    async fetchRecord() {
      if (this.record) {
        return
      }

      this._fetchTimeout = null

      try {
        this.record = await this.$ipfs.add(this.cid, { name: this.filename })
      } catch(err) {
        console.warn('[NetworkObject] Failed to obtain the record, trying again.')
        this.$ipfs.remove(this.cid)
        this._fetchTimeout = setTimeout(this.fetchRecord.bind(this), 500)
      }
    },

    async nodeDownload() {
      if (!this.record || this.record.isDirectory || !this.record.file) {
        return
      }

      try {
        this.nodeDownloadLoading = true

        const blob = await this.record.file.getBlob()

        downloadBlob(blob, this.filename || this.cid)

        this.$bus.emit('node.download')
      } catch (err){
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