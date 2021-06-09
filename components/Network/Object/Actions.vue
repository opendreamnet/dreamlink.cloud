<template>
  <Box>
    <template #header>
      <h2 class="title">
        <span class="icon"><FontAwesomeIcon icon="directions" /></span>
        <span>Node Actions</span>
      </h2>
    </template>

    <div v-if="!record" class="flex justify-center">
      <Loading class="scale-150" />
    </div>

    <div v-else class="actions">
      <Button v-if="!record.isDirectory" v-tooltip="'Download the file with your node, this can take a very long time. Only recommended with files that you have uploaded.'" :loading="nodeDownloadLoading" @click="nodeDownload">
        Download
      </Button>

      <!--
      <Button class="button--success">PIN</Button>
      -->
    </div>
  </Box>
</template>

<script lang="ts">
import NetworkObject from '~/mixins/NetworkObject'

export default NetworkObject.extend({

})
</script>

<style lang="scss" scoped>
.actions {
  @apply space-y-3;

  .button {
    @apply block w-full;
  }
}
</style>
