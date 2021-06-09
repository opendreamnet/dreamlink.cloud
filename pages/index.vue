<template>
  <div class="upload">
    <div class="upload__hero">
      <h1 class="title">
        Share files on the <span class="text-ipfs">IPFS network</span>.
      </h1>
      <h2>File storage controlled by you, free and uncensored in a decentralized network.</h2>
    </div>

    <input v-show="false" ref="files" type="file" multiple @change="upload">

    <div class="upload__content">
      <div class="upload__buttons">
        <Button v-if="$ipfs.ready" key="upload-button" class="button-xl" @click="$refs.files.click()">
          <span class="icon"><FontAwesomeIcon icon="upload" /></span>
          <span>Upload files</span>
        </Button>

        <Button v-else-if="$ipfs.error" key="error-button" v-tooltip="'Your IPFS node has not started correctly.'" class="button-xl button--danger" @click="$bus.emit('node.dialog')">
          <span class="icon"><FontAwesomeIcon icon="exclamation-triangle" /></span>
          <span>Node Error</span>
        </Button>

        <Button v-else key="waiting-button" class="button-xl" :loading="true">
          <span>Upload files</span>
        </Button>

        <Button el="NuxtLink" to="/about#how" class="button--primary button-xl">
          <span class="icon"><FontAwesomeIcon icon="question" /></span>
          <span>How it works?</span>
        </Button>
      </div>

      <p class="text-sm">
        OR...
      </p>

      <div class="upload__cid">
        <input v-model="cid" placeholder="CID" class="input">
        <input v-model="filename" placeholder="File name (Optional)" class="input">
        <Button class="button--sm" @click="open">
          Open
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import isIPFS from 'is-ipfs'
import Swal from 'sweetalert2'

export default Vue.extend({
  data: () => ({
    cid: '',
    filename: ''
  }),

  methods: {
    async upload(event: Event) {
      const input = event.target as HTMLInputElement
      const { files } = input

      if (!files || files.length === 0) {
        return
      }

      let cid = ''
      let route = '/explorer?'

      try {
        Swal.fire({
          title: 'Uploading...',
          text: 'This can take up to several minutes for large files.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false
        })

        if (files.length === 1) {
          const file = files[0]

          cid = await this.$ipfs.upload(file, { pin: false })
          route += `cid=${cid}&filename=${file.name}`
        } else {
          cid = await this.$ipfs.upload(files, { pin: false, wrapWithDirectory: true })
          route += `cid=${cid}`
        }

        Swal.close()

        this.$bus.emit('upload.success')
        this.$router.push(route)
      } catch (err) {
        Swal.fire({
          title: 'A problem has occurred',
          text: err.message,
          icon: 'error'
        })
      }

      input.value = ''
    },

    open() {
      if (!isIPFS.cid(this.cid)) {
        Swal.fire({
          title: 'CID invalid',
          html: 'Please enter a valid IPFS CID.',
          icon: 'warning'
        })

        return
      }

      this.$router.push(`/explorer?cid=${this.cid}&filename=${this.filename}`)
    }
  }
})
</script>

<style lang="scss" scoped>
.upload__hero {
  @apply mb-20 text-center;

  h1 {
    @apply text-4xl mb-3;
  }

  h2 {
    @apply text-lg text-snow-dark;
  }
}

.upload__content {
  @apply flex flex-col items-center gap-6;
}

.upload__buttons {
  @apply text-center space-x-3;
}

.upload__cid {
  @apply text-center space-y-3;
  max-width: 300px;
}
</style>
