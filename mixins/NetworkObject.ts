import Vue from 'vue'
import { Record } from '@opendreamnet/ipfs'
import { downloadBlob } from '../modules/utils'

interface Data {
  record: Record | null
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
    nodeDownloadLoading: false
  }),

  created() {
    this.$ipfs.add(this.cid, { name: this.filename }).then((record) => this.record = record)
  },

  methods: {
    async nodeDownload() {
      if (!this.record || this.record.isDirectory || !this.record.file) {
        return
      }

      console.log('nodeDownload')

      try {
        this.nodeDownloadLoading = true

        const blob = await this.record.file.getBlob()

        downloadBlob(blob, this.filename || this.cid)

        this.$bus.emit('node.download')
      } catch (err){ 
        console.warn('nodeDownload', err)
      } finally {
        this.nodeDownloadLoading = false
      }
    }
  }
})