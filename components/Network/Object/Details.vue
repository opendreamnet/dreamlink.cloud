<template>
  <Box>
    <template #header>
      <h2 class="title">
        <span class="icon"><FontAwesomeIcon icon="book" /></span>
        <span>Details</span>
      </h2>
    </template>

    <div v-if="record" class="prose details">
      <p>
        <span class="title">Size:</span>
        <span class="value">{{ record.length | prettyBytes }}</span>
      </p>

      <p v-if="record.isDirectory">
        <span class="title">Files:</span>
        <span class="value">{{ record.files.length }}</span>
      </p>

      <p v-if="record.isStored !== undefined" v-tooltip="'This file is taking up space on your device and you are contributing to its distribution.'">
        <span class="title">In storage:</span>
        <span class="value">{{ record.isStored ? 'Yes' : 'No' }}</span>
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
    @apply block;
  }

  .value {
    @apply text-sm text-snow-dark;
  }
}
</style>
