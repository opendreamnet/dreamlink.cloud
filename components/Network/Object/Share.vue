<template>
  <Box>
    <template #header>
      <h2 class="title">
        <span class="icon"><FontAwesomeIcon icon="share" /></span>
        <span>Share</span>
      </h2>
    </template>

    <section>
      <p>Share this link so they can see file information and direct links:</p>
      <InputPlus readonly :value="classicURL" />
    </section>

    <hr>

    <section class="share__gateways">
      <p>Share any of these links to view or download the file directly:</p>
      <NetworkObjectUrl v-for="url in gatewaysURLS" :key="url" :cid="cid" :filename="filename" :url="url" />
    </section>
  </Box>
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
        'ipfs.mihir.ch'
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
