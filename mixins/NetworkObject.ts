import Vue from 'vue'
import { Entry } from '@opendreamnet/ipfs'
import { isEmpty } from 'lodash'

interface IData {
  /**
   * URI instance of the first trusted gateway to have the object.
   */
  gatewayURI: URI | null
  /**
   * True if the object is being downloaded using the node.
   */
  nodeDownloadLoading: boolean
}

export default Vue.extend({
  props: {
    entry: {
      type: Object as () => Entry,
      default: null
    },
    cid: {
      type: String,
      required: true
    }
  },

  data: (): IData => ({
    gatewayURI: null,
    nodeDownloadLoading: false
  }),

  computed: {
    filename(): string {
      return this.entry?.name
    }
  },

  created() {
    this.$events.on(`${this.cid}.gateway.status`, this.onGatewayStatus)
  },

  beforeDestroy() {
    this.$events.off(`${this.cid}.gateway.status`, this.onGatewayStatus)
  },

  methods: {
    /**
     * Download the object using the IPFS node.
     */
     async nodeDownload() {
      if (!this.entry || this.entry.type === 'dir') {
        return
      }

      try {
        this.nodeDownloadLoading = true

        await this.entry.downloadAsBlob(this.filename || this.cid)

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