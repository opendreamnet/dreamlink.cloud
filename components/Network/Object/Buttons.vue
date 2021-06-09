<template>
  <div v-if="record" class="object">
    <div v-if="!record.isDirectory" class="justify-center buttons">
      <Button v-if="!downloadURL" @click="nodeDownload()">
        <span class="icon"><FontAwesomeIcon icon="download" /></span>
        <span>Download</span>
      </Button>

      <Button v-else el="a" :href="downloadURL">
        <span class="icon"><FontAwesomeIcon icon="download" /></span>
        <span>Download</span>
      </Button>

      <Button el="a" target="_blank" :href="previewURL" :loading="!previewURL" class="button--primary">
        <span class="icon"><FontAwesomeIcon icon="external-link-square-alt" /></span>
        <span>Open</span>
      </Button>
    </div>

    <div v-else class="justify-center buttons">
      <Button el="a" target="_blank" :href="previewURL" :loading="!previewURL" class="button--primary">
        <span class="icon"><FontAwesomeIcon icon="folder-open" /></span>
        <span>Open</span>
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
</template>

<script lang="ts">
import NetworkObject from '~/mixins/NetworkObject'

export default NetworkObject.extend({
  computed: {
    downloadURL(): string | null {
      if (!this.gatewayURI) {
        return null
      }

      return this.gatewayURI.clone().query({ filename: this.filename, download: 'true' }).href()
    },
    previewURL(): string | null {
      if (!this.gatewayURI) {
        return null
      }

      return this.gatewayURI.clone().query({ filename: this.filename, download: 'false' }).href()
    }
  }
})
</script>
