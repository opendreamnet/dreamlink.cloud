<template>
  <div class="share">
    <Section title="Share" subtitle="View, download and help in the distribution of the file.">
      <InputPlus readonly :value="explorerURL" class="text--sm" />
    </Section>

    <Section title="Direct links" subtitle="Trusted gateways where anyone can access the file directly.">
      <div class="share__gateways">
        <NetworkObjectUrl
          v-for="(gateway, it) in gateways"
          :key="it"
          :gateway="gateway" />
      </div>
    </Section>
  </div>
</template>

<script lang="ts">
import queryString from 'query-string'
import Vue from 'vue'
import { Gateway } from '~/modules/gateway'

export default Vue.extend({
  props: {
    cid: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: null
    }
  },

  computed: {
    /**
     * URL to the explorer.
     */
    explorerURL(): string {
      return document.location.origin + '/explorer?' + queryString.stringify({
        cid: this.cid,
        name: this.name
      }, {
        skipNull: true
      })
    },

    /**
     * URLs to public gateways.
     */
    gateways() {
      return Gateway.fromAll(this.cid, this.name)
    }
  }
})
</script>

<style lang="scss" scoped>
.share__content {
  @apply space-y-6;
}

section {
  @apply mb-6;
}

.share__gateways {
  @apply overflow-auto overscroll-contain pr-3 space-y-6;

  h2 {
    @apply text-lg font-semibold;
  }
}
</style>
