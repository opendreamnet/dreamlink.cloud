<template>
  <Box>
    <template #header>
      <h2 class="title">
        <span class="icon"><FontAwesomeIcon icon="database" /></span>
        <span>Actions</span>
      </h2>
    </template>

    <div v-if="entry" class="actions">
      <NetworkObjectActionsPin :entry="entry" :cid="cid" />
      <NetworkObjectActionsDownload :entry="entry" :cid="cid" />
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

})
</script>

<style lang="scss" scoped>
.actions {
  @apply space-y-6;

  .button {
    @apply block w-full;
  }
}
</style>
