<template>
  <InputPlus
    :value="shareURL"
    :status="status"
    :disabled="!ready"
    readonly
    :open="true"
    class="text-sm" />
</template>

<script lang="ts">
import Vue from 'vue'
import { isNil } from 'lodash'
import URI from 'urijs'
import axios from 'axios'
import { GATEWAYS_TRUSTED } from '~/modules/defs'

interface Data {
  status: boolean
  attempts: number
  // eslint-disable-next-line no-undef
  tryTimeout: NodeJS.Timeout | null
}

const MAX_ATTEMPTS = 12 // 2 minutes

export default Vue.extend({
  props: {
    cid: {
      type: String,
      required: true
    },
    filename: {
      type: String,
      default: null
    },
    url: {
      type: String,
      default: 'https://ipfs.io'
    },
    download: {
      type: Boolean,
      default: null
    },
    delay: {
      type: Number,
      default: 0
    }
  },

  data: (): Data => ({
    status: false,
    attempts: 0,
    tryTimeout: null
  }),

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

  created() {
    const delay = 3000 * this.delay
    this.tryTimeout = setTimeout(this.tryCheckStatus.bind(this), delay)
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

      if (!this.status) {
        this.tryTimeout = setTimeout(this.tryCheckStatus.bind(this), 10 * 1000)
      }
    },

    async checkStatus() {
      try {
        await axios.head(this.shareURL, {
          timeout: 5 * 1000
        })

        this.status = true

        for (const domain of GATEWAYS_TRUSTED) {
          if (this.shareURI.href().includes(domain)) {
            this.$events.emit(`${this.cid}.gateway.status`, this.shareURI)
          }
        }
      } catch (err) {
        this.status = false
      }
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
