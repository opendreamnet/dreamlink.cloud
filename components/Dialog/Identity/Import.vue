<template>
  <Box title="Import Private Key">
    <div class="space-y-12">
      <Tabs v-model="section" :tabs="categories" />

      <!-- PEM -->
      <form v-show="section === 'pem'" @submit.prevent="importPem">
        <Field title="PEM" description="Import using the contents of the key.">
          <textarea
            v-model="pem"
            required
            placeholder="-----BEGIN PRIVATE KEY-----"
            class="h-40 input" />
        </Field>

        <Button class="button--danger" :loading="loading">
          Import
        </Button>
      </form>

      <!-- Protobuf -->
      <form v-show="section === 'protobuf'" @submit.prevent="importProtobuf">
        <Field title="Protobuf" description="Private key in a recognizable format for IPFS." hint="`Identity.PrivKey` in the IPFS node configuration.">
          <textarea
            v-model="protobuf"
            required
            placeholder="CAASrBIwggkoAgEAAoICAQCzcx5z/vT..."
            class="h-40 input" />
        </Field>

        <Button class="button--danger" :loading="loading">
          Import
        </Button>
      </form>

      <!-- Key File -->
      <Field v-show="section === 'key-file'" title="Key File">
        <input
          v-show="false"
          ref="file"
          type="file"
          @change="upload">

        <div class="buttons">
          <Button class="button--primary" :loading="loading" @click="$refs.file.click()">
            Upload
          </Button>
        </div>
      </Field>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <Button class="button--danger button--sm" :loading="loading" @click="$emit('close')">
          Close
        </Button>
      </div>
    </template>
  </Box>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data: () => ({
    section: 'protobuf',
    seed: '',
    pem: '',
    protobuf: '',
    loading: false
  }),

  computed: {
    categories() {
      return ['Protobuf', 'PEM', 'Key File']
    }
  },

  methods: {
    async upload(event: Event) {
      try {
        const input = event.target as HTMLInputElement
        const { files } = input

        if (!files || files.length === 0) {
          return
        }

        this.loading = true

        const file = files[0]

        console.log(file)

        const pem = await file.text()

        console.log(pem)

        const privateKey = await PrivateKey.fromProtobufPem(pem)
        this.$accessor.settings.setIpfsPrivateKey(privateKey.toProtobuf())
        this.$accessor.settings.save()

        location.reload()
      } catch (err: any) {
        alert('Error: ' + err.message)
      } finally {
        this.loading = false
      }
    },

    /*
    async importSeed() {
      try {
        this.loading = true

        const privateKey = await PrivateKey.fromMnemonic(this.seed)
        this.$accessor.settings.setIpfsPrivateKey(privateKey.toProtobuf())
        this.$accessor.settings.save()

        location.reload()
      } catch (err) {
        console.error(err.message, err)
        alert('Error: ' + err.message)
      } finally {
        this.loading = false
      }
    },
    */

    async importPem() {
      try {
        this.loading = true

        const privateKey = await PrivateKey.fromProtobufPem(this.pem)
        this.$accessor.settings.setIpfsPrivateKey(privateKey.toProtobuf())
        this.$accessor.settings.save()

        location.reload()
      } catch (err: any) {
        alert('Error: ' + err.message)
      } finally {
        this.loading = false
      }
    },

    async importProtobuf() {
      try {
        this.loading = true

        const privateKey = await PrivateKey.fromProtobuf(this.protobuf)
        this.$accessor.settings.setIpfsPrivateKey(privateKey.toProtobuf())
        this.$accessor.settings.save()

        location.reload()
      } catch (err: any) {
        alert('Error: ' + err.message)
      } finally {
        this.loading = false
      }
    }
  }
})
</script>

<style lang="scss" scoped>
form {
  @apply space-y-9;
}
</style>
