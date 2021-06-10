<template>
  <ul v-if="cid" class="gateways">
    <li>
      <a :href="`https://dweb.link/ipfs/${cid}`" target="_blank">dweb.link</a>
    </li>

    <li>
      <a :href="`ipfs://${cid}`" target="_blank">ipfs://{{ cid }}</a>
    </li>

    <li>
      <InputPlus :value="cid" readonly class="text-sm" />
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue'

interface Data {
  cid: string | null
}

export default Vue.extend({
  data: (): Data => ({
    cid: null
  }),

  created() {
    this.fetchCID()
  },

  methods: {
    async fetchCID(): Promise<void> {
      await this.$ipfs.waitUntilReady()

      const cidPath = await this.$ipfs.api.dns('www.dreamlink.cloud') as string

      this.cid = cidPath.substring(6)
    }
  }
})
</script>

<style lang="scss" scoped>
.gateways {
  li {
    @apply overflow-hidden whitespace-nowrap overflow-ellipsis;
  }
}
</style>
