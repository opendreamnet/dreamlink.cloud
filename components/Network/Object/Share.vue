<template>
  <div class="share">
    <div class="share__content">
      <!-- Explorer URL -->
      <Box>
        <template #header>
          <h2 class="title">
            <span class="icon"><FontAwesomeIcon icon="share" /></span>
            <span>Share</span>
          </h2>
        </template>

        <InputPlus readonly :value="explorerURL" class="text--sm" />
      </Box>

      <!-- Direct Links -->
      <Box>
        <template #header>
          <div class="flex items-center gap-3">
            <h2 class="flex-1 title">
              <span class="icon"><FontAwesomeIcon icon="share" /></span>
              <span>Direct Links</span>
            </h2>
          </div>
        </template>

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
import gateways from '@opendreamnet/ipfs/src/data/ipfs-gateways.json'
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
