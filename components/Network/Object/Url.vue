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
import pRetry, { AbortError } from 'p-retry'

interface Data {
  status: boolean
  cancel: boolean
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
    cancel: false
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
    this.cancel = false
    this.start()
  },

  beforeDestroy() {
    this.cancel = true
  },

  methods: {
    start() {
      pRetry(async() => {
        if (this.cancel) {
          throw new AbortError('Cancelled')
        }

        await axios.head(this.shareURL, {
          timeout: 15 * 1000
        })

        this.status = true
        this.$events.emit(`${this.cid}.gateway.status`, this.shareURI)
      }, {
        retries: 10,
        minTimeout: 2000,
        // 10 attempts in 5 minutes
        // https://www.wolframalpha.com/input?i=Sum%5B1000*x%5Ek%2C+%7Bk%2C+0%2C+9%7D%5D+%3D+5+*+60+*+1000
        factor: 1.71023,
        randomize: true
        /* onFailedAttempt: (err) => {
          console.warn(`[${this.shareURI.host()}] ${err.message} - ${err.attemptNumber}/${err.retriesLeft}`)
        } */
      })
    },

    async fetchStatus() {
      try {
        await axios.head(this.shareURL, {
          timeout: 5 * 1000
        })

        return true
      } catch (err: any) {
        return false
      }
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
