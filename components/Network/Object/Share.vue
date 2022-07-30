<template>
  <div class="share">
    <Section title="Share" subtitle="View, download and help in the distribution of the file.">
      <InputPlus readonly :value="explorerURL" class="text--sm" />
    </Section>

    <Section title="Direct links" subtitle="Trusted gateways where anyone can access the file directly.">
      <div class="share__gateways">
        <NetworkObjectUrl
          v-for="(url, it) in gatewaysURLS"
          :key="url"
          :delay="it"
          :cid="cid"
          :filename="filename"
          :url="url" />
      </div>
    </Section>
  </div>
</template>

<script lang="ts">
import queryString from 'query-string'
import Vue from 'vue'
import gateways from '~/modules/gateways.json'
import { GATEWAYS_CORS_BLOCKED } from '~/modules/defs'

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

  data: () => ({
    gateways
  }),

  computed: {
    /**
     * URL to the explorer.
     */
    explorerURL(): string {
      return document.location.origin + '/explorer?' + queryString.stringify({
        cid: this.cid,
        filename: this.filename
      }, {
        skipNull: true
      })
    },

    /**
     * URLs to public gateways.
     */
    gatewaysURLS() {
      return gateways.filter((url) => {
        for (const u of GATEWAYS_CORS_BLOCKED) {
          if (url.includes(u)) {
            return false
          }
        }

        return true
      })
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
