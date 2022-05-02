<template>
  <div class="object">
    <div v-if="canDownload" class="justify-center buttons">
      <!-- Download with Local node -->
      <Button v-if="!downloadURL || nodeDownloadLoading" :loading="nodeDownloadLoading" @click="nodeDownload()">
        <span class="icon"><FontAwesomeIcon icon="download" /></span>
        <span>Download</span>
      </Button>

      <!-- Download with HTTP -->
      <Button v-else el="a" :href="downloadURL">
        <span class="icon"><FontAwesomeIcon icon="download" /></span>
        <span>Download</span>
      </Button>

      <!-- Open in new tab -->
      <Button
        v-if="canOpen"
        el="a"
        target="_blank"
        :href="previewURL"
        :loading="!previewURL"
        class="button--primary">
        <span class="icon"><FontAwesomeIcon icon="external-link-square-alt" /></span>
        <span>Open</span>
      </Button>
    </div>

    <!-- No download, just open -->
    <div v-else-if="canOpen" class="justify-center buttons">
      <Button
        el="a"
        target="_blank"
        :href="previewURL"
        :loading="!previewURL"
        class="button--primary">
        <span class="icon"><FontAwesomeIcon icon="folder-open" /></span>
        <span>Open</span>
      </Button>
    </div>

    <!-- Loading -->
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
    /**
     * Forced download URL.
     */
    downloadURL(): string | null {
      if (!this.gatewayURI) {
        // No gateway has responded.
        return null
      }

      return this.gatewayURI.clone().query({ filename: this.filename, download: 'true' }).href()
    },

    /**
     * File preview URL (if possible)
     */
    previewURL(): string | null {
      if (!this.gatewayURI) {
        // No gateway has responded.
        return null
      }

      return this.gatewayURI.clone().query({ filename: this.filename }).href()
    },

    /**
     * True if it is possible to download the file.
     */
    canDownload(): boolean {
      if (this.record) {
        // Only if it is not a folder.
        return !this.record.isDirectory
      }

      if (this.filename && !mime.getType(this.filename)) {
        // This looks like a folder.
        return false
      }

      if (this.downloadURL) {
        // Download via HTTP.
        return true
      }

      return false
    },

    /**
     * True if it is possible to open the file in the browser.
     */
    canOpen(): boolean {
      return !isNil(this.previewURL)
    }
  }
})
</script>
