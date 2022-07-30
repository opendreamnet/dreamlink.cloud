<template>
  <div class="upload">
    <!-- File upload -->
    <input
      v-show="false"
      ref="files"
      type="file"
      multiple
      @change="upload">

    <!-- Directory upload -->
    <input
      v-show="false"
      ref="directory"
      type="file"
      multiple
      directory
      webkitdirectory
      mozdirectory
      @change="upload">

    <div v-if="$ipfs.started" class="upload__buttons">
      <Button class="button-xl" @click="$refs.files.click()">
        <span class="icon"><FontAwesomeIcon icon="upload" /></span>
        <span>Add files</span>
      </Button>

      <Button v-if="hasDirectorySupport" class="button-xl" @click="$refs.directory.click()">
        <span class="icon"><FontAwesomeIcon icon="folder-open" /></span>
        <span>Add folder</span>
      </Button>
    </div>

    <!-- Loading -->
    <div v-else class="flex justify-center">
      <Loading class="scale-150" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Swal from 'sweetalert2'
import { ParsedQuery } from 'query-string'
import { DefaultNuxtLoading } from '@nuxt/types/app'
import { UPLOAD_DELAY } from '~/modules/defs'

export default Vue.extend({
  computed: {
    /**
     * True if the web browser has support for directory upload
     */
    hasDirectorySupport(): boolean {
      const input = document.createElement('input')

      if ('webkitdirectory' in input ||
              'mozdirectory' in input ||
              'odirectory' in input ||
              'msdirectory' in input ||
              'directory' in input) { return true }

      return false
    }
  },

  methods: {
    /**
     * User wants to upload file(s)
     */
    async upload(event: Event) {
      const input = event.target as HTMLInputElement
      const { files } = input

      if (!files || files.length === 0) {
        return
      }

      try {
        Swal.fire({
          title: 'Uploading...',
          text: 'This may take several minutes on large files.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false
        })

        // Upload to MFS
        const { cid, name } = await this.$accessor.ipfs.upload({
          files,
          loading: this.$nuxt.$loading as DefaultNuxtLoading
        })

        // Notify storage
        this.$events.emit('upload.success')

        Swal.fire({
          title: 'Sharing your file...',
          text: 'This may take a few minutes.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false
        })

        // Request caching on the most popular gateway
        await this.$accessor.ipfs.finishUpload(cid)

        // Close alert
        Swal.close()

        const query: ParsedQuery = {
          uploader: 'true', // More appropriate messages for the uploader
          cid,
          name
        }

        // Open explorer
        this.$router.push({
          path: '/explorer',
          query
        })
      } catch (err: any) {
        Swal.fire({
          title: 'A problem has occurred',
          text: err.message,
          icon: 'error'
        })

        console.trace(err)
      }

      // Reset
      this.$nuxt.$loading.finish()
      input.value = ''
    }
  }
})
</script>

<style lang="scss" scoped>
.upload__buttons {
  @apply flex justify-center gap-6;
}
</style>
