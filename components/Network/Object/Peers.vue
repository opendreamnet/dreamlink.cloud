<template>
  <Box>
    <template #header>
      <h2 class="title">
        <span class="icon"><FontAwesomeIcon icon="share" /></span>
        <span>Peers</span>
      </h2>
    </template>

    <div v-if="!record" class="loading">
      Loading...
    </div>

    <div v-else class="peers">
      <li v-for="peer in record.peers" :key="peer.id">
        {{ peer.id }}
      </li>
    </div>
  </Box>
</template>

<script lang="ts">
import Vue from 'vue'
import { Entry } from '@opendreamnet/ipfs'

interface Data {
  record: Entry | null
}

export default Vue.extend({
  props: {
    cid: {
      type: String,
      required: true
    }
  },

  data: (): Data => ({
    record: null
  }),

  created() {
    // eslint-disable-next-line promise/catch-or-return,promise/always-return
    this.$ipfs.fromCID(this.cid, { peers: true }).then((record) => { this.record = record })
  }
})
</script>
