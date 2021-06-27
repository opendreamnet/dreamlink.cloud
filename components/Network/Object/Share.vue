<template>
  <div class="share">
    <div class="share__content">
      <Box>
        <template #header>
          <h2 class="title">
            <span class="icon"><FontAwesomeIcon icon="share" /></span>
            <span>Share</span>
          </h2>
        </template>

        <InputPlus readonly :value="classicURL" class="text--sm" />
      </Box>

      <Box>
        <template #header>
          <div class="flex items-center gap-3">
            <h2 class="flex-1 title">
              <span class="icon"><FontAwesomeIcon icon="share" /></span>
              <span>Direct Links</span>
            </h2>

            <a href="#" class="text-sm text-danger" @click.prevent="$refs.dialog.open()">Not working?</a>
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

    <DialogPersistence ref="dialog" />
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
        'bin.d0x.to',
        'drink.cafe',
        'ipfs.taxi'
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
