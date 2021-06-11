<template>
  <Box>
    <template #header>
      <h2 class="title">
        <span class="icon"><FontAwesomeIcon icon="book" /></span>
        <span>Details</span>
      </h2>
    </template>

    <div v-if="record" class="details">
      <p>
        <span class="title">CID: <Tooltip content="This is how your file is identified on the network and is necessary to return to it." /></span>
        <InputPlus class="input--sm" :value="record.cid" />
      </p>

      <p>
        <span class="title">Size:</span>
        <span class="value">{{ record.length | prettyBytes }}</span>
      </p>

      <p>
        <span class="title">Files:</span>
        <span class="value">{{ record.files.length }}</span>
      </p>

      <hr>

      <div class="details__actions">
        <Button v-if="!record.isDirectory" v-tooltip="downloadTooltip" :loading="nodeDownloadLoading" @click="nodeDownload">
          <span class="icon"><FontAwesomeIcon icon="save" /></span>
          <span>Download</span>
        </Button>
      </div>
    </div>

    <div v-else-if="$ipfs.error" class="flex justify-center" @click="$bus.emit('node.dialog')">
      <Button class="button--danger">
        <span class="icon"><FontAwesomeIcon icon="exclamation-triangle" /></span>
        <span>Node Error</span>
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
      
- If the file is not in your storage then this may take several minutes but you will increase the life of the file by starting to seed it.
- Otherwise you will download the file instantly.`)
    }
  },

  created() {
    // eslint-disable-next-line promise/catch-or-return,promise/always-return
    this.$ipfs.add(this.cid).then((record) => { this.record = record })
  }
})
</script>

<style lang="scss" scoped>
.details {
  .title {
    @apply block;
  }

  .value {
    @apply text-sm;
  }
}

.details__actions {
  @apply space-y-3;

  .button {
    @apply block w-full;
  }
}
</style>
