<template>
  <Box>
    <template #header>
      <h2 class="title">
        <span class="icon"><FontAwesomeIcon icon="book" /></span>
        <span>Details</span>
      </h2>
    </template>

    <div v-if="entry" class="prose details">
      <p>
        <span class="title">Size:</span>
        <span v-if="entry.size === 0 && entry.loading" class="value">Loading...</span>
        <span v-else class="value">{{ entry.size | prettyBytes }}</span>
      </p>

      <p v-if="entry.type === 'dir'">
        <span class="title">Files:</span>
        <span v-if="entry.subEntries.length === 0 && entry.loading" class="value">Loading...</span>
        <span v-else class="value">{{ entry.subEntries.length }}</span>
      </p>

      <p v-tooltip="'Number of IPFS nodes distributing this entry. (Not always correct)'">
        <span class="title">Peers:</span>
        <span v-if="!entry.peers || entry.peers.length === 0 && entry.loading" class="value">Loading...</span>
        <span v-else class="value">{{ entry.peers.length }}</span>
      </p>
    </div>

    <div v-else-if="$ipfs.error" class="flex justify-center">
      <Button el="NuxtLink" to="/app/profile" class="button--danger">
        <span class="icon"><FontAwesomeIcon icon="exclamation-triangle" /></span>
        <span>IPFS Error</span>
      </Button>
    </div>

    <div v-else class="flex justify-center">
      <Loading class="scale-150" />
    </div>
  </Box>
</template>

<script lang="ts">
import NetworkObject from '~/mixins/NetworkObject'

export default NetworkObject.extend({
  computed: {
    downloadTooltip() {
      return this.$md.render(`Download the file using your IPFS node:
      
- If the file is not in your storage then this may take several minutes but you will increase the availability of the file by starting to distributing it.
- Otherwise you will download the file instantly.`)
    }
  }
})
</script>

<style lang="scss" scoped>
.details {
  .title {
    @apply block font-bold;
  }

  .value {
    @apply text-sm text-snow-darker;
  }
}
</style>
