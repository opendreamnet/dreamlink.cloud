<template>
  <InputPlus
    :value="shareURL"
    :status="status"
    :disabled="!available"
    readonly
    :open="true"
    class="text-sm" />
</template>

<script lang="ts">
import Vue from 'vue'
import { Gateway } from '~/modules/gateway'

interface Data {
  status: boolean
}

export default Vue.extend({
  props: {
    gateway: {
      type: Object as () => Gateway,
      required: true
    },
    download: {
      type: Boolean,
      default: null
    }
  },

  data: (): Data => ({
    status: false
  }),

  computed: {
    shareURL(): string {
      return this.gateway.getShareURL(this.download)
    },

    available(): boolean {
      return this.status === true
    }
  },

  created() {
    this.start()
  },

  beforeDestroy() {
    this.gateway.abortCheck()
  },

  methods: {
    async start() {
      const available = await this.gateway.untilAvailable()

      if (available) {
        this.status = true
        this.$events.emit(`${this.gateway.cid}.gateway.status`, this.gateway.shareURI)
      }
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
