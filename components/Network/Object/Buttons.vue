<template>
  <div class="object">
    <div v-if="canDownload" class="justify-center buttons">
      <Button v-if="!downloadURL" @click="nodeDownload()">
        <span class="icon"><FontAwesomeIcon icon="download" /></span>
        <span>Download</span>
      </Button>

      <Button v-else el="a" :href="downloadURL">
        <span class="icon"><FontAwesomeIcon icon="download" /></span>
        <span>Download</span>
      </Button>

      <Button
        v-if="canOpen"
        el="a"
        target="_blank"
        :href="previewURL"
        :loading="!previewURL"
        class="button--primary"
      >
        <span class="icon"><FontAwesomeIcon icon="external-link-square-alt" /></span>
        <span>Open</span>
      </Button>
    </div>

    <div v-else-if="canOpen" class="justify-center buttons">
      <Button el="a" target="_blank" :href="previewURL" :loading="!previewURL" class="button--primary">
        <span class="icon"><FontAwesomeIcon icon="folder-open" /></span>
        <span>Open</span>
      </Button>
    </div>

    <div v-else class="flex justify-center">
      <Loading class="scale-150" />
    </div>
  </div>
</template>

<script lang="ts">
import { isNil } from 'lodash'
import mime from 'mime'
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
    },
    canDownload(): boolean {
      if (this.record && this.record.isDirectory) {
        return false
      } else if (this.filename && !mime.getType(this.filename)) {
        return false
      }

      return !isNil(this.downloadURL)
    },
    canOpen(): boolean {
      return !isNil(this.previewURL)
    }
  }
})
</script>
