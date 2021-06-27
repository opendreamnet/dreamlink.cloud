<template>
  <div class="home">
    <!-- Hero -->
    <div class="home__hero">
      <h1 class="title">
        Share files on the <span class="text-ipfs">IPFS network</span>.
      </h1>

      <h2>File storage controlled by you, free and censorship-proof in a decentralized network.</h2>
    </div>

    <div class="home__content">
      <input
        v-show="false" ref="files" type="file"
        multiple @change="upload">

      <input
        v-show="false"
        ref="directory"
        type="file"
        multiple
        directory
        webkitdirectory
        mozdirectory
        @change="upload">

      <!-- Methods -->
      <div class="home__methods">
        <Button :class="{ 'item--active': method === 0 }" @click.prevent="method = 0">
          Upload
        </Button>

        <Button v-tooltip="'Get an IPFS record by its CID.'" :class="{ 'item--active': method === 1 }" @click.prevent="method = 1">
          CID
        </Button>
        <!--
          <Button v-tooltip="'Get the latest version of an IPFS object with its IPNS.'" :class="{ 'item--active': method === 2 }" @click.prevent="method = 2">
            IPNS
          </Button>
          -->
        <Button v-tooltip="'Get an IPFS record using its link to the DNS.'" :class="{ 'item--active': method === 3 }" @click.prevent="method = 3">
          DNSLink
        </Button>
      </div>

      <!-- Upload -->
      <section v-show="method === 0" class="home__section">
        <div v-if="$ipfs.ready" class="home__buttons">
          <Button class="button-xl" @click="$refs.files.click()">
            <span class="icon"><FontAwesomeIcon icon="upload" /></span>
            <span>Add files</span>
          </Button>

          <Button class="button-xl" @click="$refs.directory.click()">
            <span class="icon"><FontAwesomeIcon icon="folder-open" /></span>
            <span>Add folder</span>
          </Button>
        </div>

        <!-- Error -->
        <div v-else-if="$ipfs.error" class="home__buttons">
          <Button
            key="error-button" v-tooltip="'Your IPFS node has not started correctly.'" class="button-xl button--danger"
            @click="$bus.emit('node.dialog')">
            <span class="icon"><FontAwesomeIcon icon="exclamation-triangle" /></span>
            <span>Node Error</span>
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
            v-model="cid" placeholder="CID" class="input"
            required>

          <input v-model="filename" placeholder="File name (Optional)" class="input">

          <Button class="button--sm">
            Open
          </Button>
        </form>
      </section>

      <!-- IPNS (Unfinished) -->
      <section v-show="method === 2" class="home__section">
        <form @submit.prevent="openIPNS()">
          <input
            v-model="ipns" placeholder="IPNS" class="input"
            required>

          <input v-model="filename" placeholder="File name (Optional)" class="input">

          <Button class="button--sm">
            Open
          </Button>
        </form>
      </section>

      <!-- DNSLink -->
      <section v-show="method === 3" class="home__section">
        <form v-if="$ipfs.ready" @submit.prevent="openDNS()">
          <input
            v-model="dnslink" placeholder="www.dreamlink.cloud" class="input"
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
import Vue from 'vue'
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

  h1 {
    @apply text-4xl mb-2;
  }

  h2 {
    @apply text-lg text-snow-dark;
  }
}

.home__content {
  @apply flex flex-col items-center gap-3 mx-auto max-w-prose;
}

.home__section {
  @apply w-full text-center;

  form {
    @apply space-y-3;
  }
}

.home__methods {
  @apply flex justify-between w-full mb-3;

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
