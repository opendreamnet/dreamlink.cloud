import Vue from 'vue'
import URI from 'urijs'
import { Record } from '@opendreamnet/ipfs'
import { downloadBlob } from '../modules/utils'

interface Data {
  record: Record | null
  gatewayURI: URI | null
  nodeDownloadLoading: boolean
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
    nodeDownloadLoading: false
  }),

  created() {
    // eslint-disable-next-line promise/catch-or-return
    this.$ipfs.add(this.cid, { name: this.filename }).then((record) => this.record = record)

    this.$bus.on(`${this.cid}.gateway.status`, this.onGatewayStatus)
  },

  beforeDestroy() {
    this.$bus.off(`${this.cid}.gateway.status`, this.onGatewayStatus)
  },

  methods: {
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
      if (uri.href().includes('odn.pw') && !this.gatewayURI) {
        this.gatewayURI = uri
      }

      if (uri.href().includes('fs.dreamlink.cloud') && !this.gatewayURI) {
        this.gatewayURI = uri
      }

      if (uri.href().includes('ipfs.io') && !this.gatewayURI) {
        this.gatewayURI = uri
      }

      if (uri.href().includes('dweb.link') && !this.gatewayURI) {
        this.gatewayURI = uri
      }
    }
  }
})