<template>
  <div class="share">
    <Box>
      <template #header>
        <h2 class="title">
          <span class="icon"><FontAwesomeIcon icon="share" /></span>
          <span>Share</span>
        </h2>
      </template>

      <section>
        <InputPlus readonly :value="classicURL" class="text--sm" />
      </section>
    </Box>

    <Box>
      <template #header>
        <h2 class="title">
          <span class="icon"><FontAwesomeIcon icon="share" /></span>
          <span>Direct Links</span>
        </h2>
      </template>

      <section class="share__gateways">
        <NetworkObjectUrl
          v-for="(url, it) in gatewaysURLS"
          :key="url"
          :delay="it"
          :cid="cid"
          :filename="filename"
          :url="url"
        />
      </section>
    </Box>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import gateways from '@opendreamnet/ipfs/src/data/ipfs-gateways.json'

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
    classicURL(): string {
      return document.location.href
    },

    gatewaysURLS() {
      const corsBlock = [
        'cf-ipfs.com',
        'overpi.com',
        'ipfs.fooock.com',
        'storjipfs-gateway.com',
        'ipfs.runfission.com',
        'trusti.id',
        'hashnews.k1ic.com',
        'ipfs.mihir.ch',
        'ipfs.globalupload.io',
        'ipfs.eternum.io',
        'bin.d0x.to'
      ]

      return gateways.filter((url) => {
        for (const u of corsBlock) {
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
.share {
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
