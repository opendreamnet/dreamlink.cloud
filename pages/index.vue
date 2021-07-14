<template>
  <div class="home">
    <!-- Hero -->
    <div class="home__hero">
      <h1 class="mb-2 text-4xl title">
        Share files using <span class="text-ipfs">IPFS</span>
      </h1>

      <h2 class="text-lg text-snow-dark">
        File storage controlled by you, free and censorship-proof in a decentralized network.
      </h2>
    </div>

    <input
      v-show="false"
      ref="files"
      type="file"
      multiple
      @change="upload">

    <input
      v-show="false"
      ref="directory"
      type="file"
      multiple
      directory
      webkitdirectory
      mozdirectory
      @change="upload">

    <div class="home__content">
      <!-- Methods -->
      <ButtonsMenu v-model="method" class="home__methods" :data="{ 'Upload': 0, 'CID': 1, 'DNSLink': 3 }" />

      <!-- Upload -->
      <section v-show="method === 0" class="home__section">
        <div v-if="$ipfs.ready" class="flex justify-center gap-6">
          <Button class="button-xl" @click="$refs.files.click()">
            <span class="icon"><FontAwesomeIcon icon="upload" /></span>
            <span>Add files</span>
          </Button>

          <Button v-if="hasDirectorySupport" class="button-xl" @click="$refs.directory.click()">
            <span class="icon"><FontAwesomeIcon icon="folder-open" /></span>
            <span>Add folder</span>
          </Button>
        </div>

        <!-- Error -->
        <div v-else-if="$ipfs.error" class="home__buttons">
          <Button
            key="error-button"
            v-tooltip="'Your IPFS node has not started correctly.'"
            el="NuxtLink"
            to="/app/profile"
            class="button-xl button--danger">
            <span class="icon"><FontAwesomeIcon icon="exclamation-triangle" /></span>
            <span>IPFS Error</span>
          </Button>
        </div>

        <!-- Loading -->
        <div v-else class="flex justify-center">
          <Loading class="scale-150" />
        </div>
      </section>

      <!-- CID -->
      <section v-show="method === 1" class="home__section">
        <form @submit.prevent="openCID()">
          <input
            v-model="cid"
            placeholder="CID"
            class="input"
            required>

          <input v-model="filename" placeholder="Object name (Optional)" class="input">

          <Button class="button--sm">
            Open
          </Button>
        </form>
      </section>

      <!-- IPNS (Unfinished) -->
      <section v-show="method === 2" class="home__section">
        <form @submit.prevent="openIPNS()">
          <input
            v-model="ipns"
            placeholder="IPNS"
            class="input"
            required>

          <input v-model="filename" placeholder="Object name (Optional)" class="input">

          <Button class="button--sm">
            Open
          </Button>
        </form>
      </section>

      <!-- DNSLink -->
      <section v-show="method === 3" class="home__section">
        <form v-if="$ipfs.ready" @submit.prevent="openDNS()">
          <input
            v-model="dnslink"
            placeholder="www.dreamlink.cloud"
            class="input"
            required>

          <Button class="button--sm">
            Open
          </Button>
        </form>

        <!-- Loading -->
        <div v-else class="flex justify-center">
          <Loading class="scale-150" />
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import queryString, { ParsedQuery } from 'query-string'
import Vue from 'vue'
import { isString, reduce } from 'lodash'
import isIPFS from 'is-ipfs'
import Swal from 'sweetalert2'

export default Vue.extend({
  data: () => ({
    method: 0,

    cid: '',
    filename: '',

    ipns: '',
    dnslink: '',

    query: ''
  }),

  computed: {
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
    async upload(event: Event) {
      const input = event.target as HTMLInputElement
      const { files } = input

      if (!files || files.length === 0) {
        return
      }

      const query: ParsedQuery = {
        uploader: 'true'
      }

      let size: number | undefined

      try {
        Swal.fire({
          title: 'Uploading...',
          text: 'This can take up to several minutes for large files.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false
        })

        if (files.length === 1) {
          query.filename = files[0].name
          size = files[0].size
          query.cid = await this.$ipfs.upload(files[0], { pin: true })
        } else {
          // @ts-ignore
          const relativePath: string | undefined = files[0].webkitRelativePath

          size = reduce(files, (accumulator, value) => {
            return accumulator + value.size
          }, 0)

          if (relativePath) {
            // This is a directory, we can take the name out and pin it.
            query.filename = relativePath.split('/')[0]
            query.cid = await this.$ipfs.upload(files, { pin: true })

            await this.$accessor.pins.create({
              cid: query.cid,
              name: isString(query.filename) ? query.filename : undefined,
              size
            })
          } else {
            // This is multiple files selected, we must get the name from the CID and pin only the virtual directory CID.
            query.cid = await this.$ipfs.upload(files, { pin: false, wrapWithDirectory: true })
            query.filename = query.cid.substring(query.cid.length - 10)

            await this.$accessor.pins.pin({
              cid: query.cid,
              name: query.filename,
              size
            })
          }
        }

        Swal.close()

        this.$events.emit('upload.success')
        this.$router.push('/explorer?' + queryString.stringify(query, { skipNull: true }))
      } catch (err) {
        Swal.fire({
          title: 'A problem has occurred',
          text: err.message,
          icon: 'error'
        })
      }

      input.value = ''
    },

    openCID() {
      if (!isIPFS.cid(this.cid)) {
        Swal.fire({
          title: 'CID invalid',
          html: 'Please enter a valid IPFS CID.',
          icon: 'warning'
        })

        return
      }

      this.$router.push(`/explorer?cid=${this.cid}&filename=${this.filename}`)
    },

    async openIPNS() {
      try {
        const cidPath = await this.$ipfs.api.ipns.resolve(`/ipns/${this.ipns}`) as string

        console.log(cidPath)

        const cid = cidPath.substring(6)

        this.$router.push(`/explorer?cid=${cid}&filename=${this.filename}`)
      } catch (err) {
        Swal.fire({
          title: 'A problem has occurred',
          text: err.message,
          icon: 'error'
        })

        console.warn(err)
      }
    },

    async openDNS() {
      try {
        const cidPath = await this.$ipfs.api.dns(this.dnslink) as string

        const cid = cidPath.substring(6)

        this.$router.push(`/explorer?cid=${cid}&filename=${this.dnslink}`)
      } catch (err) {
        Swal.fire({
          title: 'A problem has occurred',
          text: 'No DNS records linked to an IPFS object found.',
          icon: 'error'
        })
      }
    },

    search() {
      if (!this.$refs.searchDialog) {
        return
      }

      // @ts-ignore
      this.$refs.searchDialog.openSearch(this.query)

      this.query = ''
    }
  }
})
</script>

<style lang="scss" scoped>
.home {
  @apply space-y-20;
}

.home__hero {
  @apply text-center;
}

.home__content {
  @apply flex flex-col items-center gap-10 mx-auto max-w-prose;
}

.home__section {
  @apply w-full;

  form {
    @apply space-y-4;
  }
}

.home__methods {
  @apply flex justify-between w-full;

  .button {
    @apply flex-1 rounded-none bg-opacity-0 border-t border-b border-button;

    &.item--active,
    &:hover {
      @apply bg-opacity-50;
    }

    &:first-child {
      @apply border-l rounded-l;
    }

    &:last-child {
      @apply border-r rounded-r;
    }
  }
}
</style>
