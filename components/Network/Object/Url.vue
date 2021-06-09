<template>
  <InputPlus
    :value="shareURL"
    :status="status"
    :disabled="!ready"
    readonly
    :open="true"
    class="text-sm"
  />
</template>

<script lang="ts">
import { isNil } from 'lodash'
import URI from 'urijs'
import axios from 'axios'
import NetworkObject from '~/mixins/NetworkObject'

interface Data {
  status: boolean | string
  attempts: number
  // eslint-disable-next-line no-undef
  tryTimeout: NodeJS.Timeout | null
}

const MAX_ATTEMPTS = 5

export default NetworkObject.extend({
  props: {
    url: {
      type: String,
      default: 'https://ipfs.io'
    },
    download: {
      type: Boolean,
      default: null
    }
  },

  computed: {
    shareURI(): URI {
      const uri = new URI(this.url).directory('ipfs').filename(this.cid)

      if (this.filename) {
        uri.query({ filename: this.filename })
      }

      if (!isNil(this.download)) {
        uri.query({ download: this.download ? 'true' : 'false' })
      }

      return uri
    },
    shareURL(): string {
      return this.shareURI.href()
    },
    ready(): boolean {
      return this.status === true
    }
  },

  data: (): Data => ({
    status: false,
    attempts: 0,
    tryTimeout: null
  }),

  mounted() {
    this.tryCheckStatus()
  },

  beforeDestroy() {
    if (this.tryTimeout) {
      clearTimeout(this.tryTimeout)
    }
  },

  methods: {
    async tryCheckStatus() {
      this.tryTimeout = null
      this.attempts += 1

      if (this.attempts > MAX_ATTEMPTS) {
        return
      }

      await this.checkStatus()

      if (this.status !== true) {
        this.tryTimeout = setTimeout(this.tryCheckStatus.bind(this), 5000)
      }
    },

    async checkStatus() {
      try {
        await axios.head(this.shareURL, {
          timeout: 5000
        })

        this.status = true
        this.$bus.emit(`${this.cid}.gateway.status`, this.shareURI)
      } catch (err) {
        // this.status = err
        this.status = false
      }
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
