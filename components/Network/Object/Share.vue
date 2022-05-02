<template>
  <div class="share">
    <div class="share__content">
      <!-- Explorer URL -->
      <Box title="Share" subtitle="This link allows to view, download and help in the distribution of the file.">
        <InputPlus readonly :value="explorerURL" class="text--sm" />
      </Box>

      <!-- Direct Links -->
      <Box title="Direct Links" subtitle="Trusted gateways where anyone can access the file directly.">
        <div class="share__gateways">
          <NetworkObjectUrl
            v-for="(url, it) in gatewaysURLS"
            :key="url"
            :delay="it"
            :cid="cid"
            :filename="filename"
            :url="url" />
        </div>
      </Box>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import queryString from 'query-string'
import gateways from '@opendreamnet/ipfs/src/data/gateways.json'
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
  @apply overflow-auto overscroll-contain pr-3 space-y-3;
  max-height: 300px;

  h2 {
    @apply text-lg font-semibold;
  }
}
</style>
