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
import queryString, { ParsedQuery } from 'query-string'
import { isString, reduce } from 'lodash'
import { DefaultNuxtLoading } from '@nuxt/types/app'

export default Vue.extend({
  computed: {
    /**
     * Indicates if the web browser has support for directory upload
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

      const query: ParsedQuery = {
        // More appropriate messages for the uploader
        uploader: 'true'
      }

      // Total file size
      let size: number | undefined

      try {
        // Show loading
        (this.$nuxt.$loading as DefaultNuxtLoading).continuous = true
        this.$nuxt.$loading.start()

        Swal.fire({
          title: 'Uploading...',
          text: 'This can take up to several minutes for large files.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false
        })

        if (files.length === 1) {
          size = files[0].size

          // Url query
          query.name = files[0].name
          query.cid = (await this.$ipfs.add(files[0], { pin: true })).cid.toString()

          // Save the record data in the database
          await this.$accessor.pins.pin({
            cid: query.cid,
            name: query.name,
            size
          })
        } else {
          // @ts-ignore
          const relativePath: string | undefined = files[0].webkitRelativePath

          // Total for all files
          size = reduce(files, (accumulator, value) => accumulator + value.size, 0)

          if (relativePath) {
            // This is a directory, take the name out
            query.name = relativePath.split('/')[0]
            query.cid = (await this.$ipfs.add(files, { pin: true })).cid.toString()

            // Save the record data in the database
            await this.$accessor.pins.create({
              cid: query.cid,
              name: isString(query.name) ? query.name : undefined,
              size
            })
          } else {
            // Multiple files selected, get the name from the CID and pin only the virtual directory CID.
            query.cid = (await this.$ipfs.add(files, { pin: false })).cid.toString()
            query.name = query.cid.substring(query.cid.length - 10)

            // Save the record data in the database
            await this.$accessor.pins.pin({
              cid: query.cid,
              name: query.name,
              size
            })
          }
        }

        Swal.close()
        this.$events.emit('upload.success')

        // Reload the page to get better results
        document.location.href = '/explorer?' + queryString.stringify(query, { skipNull: true })
      } catch (err: any) {
        Swal.fire({
          title: 'A problem has occurred',
          text: err.message,
          icon: 'error'
        })
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
