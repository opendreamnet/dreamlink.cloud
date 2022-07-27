<template>
  <dialog class="dialog">
    <Box title="Export Private Key">
      <div class="space-y-12">
        <ButtonsMenu
          v-model="section"
          :data="categories" />

        <!-- PEM -->
        <Field v-show="section === 'pem'" title="PEM" description="This is the contents of your key file.">
          <div class="space-y-3">
            <input
              v-model="password"
              type="password"
              class="input"
              placeholder="Password (Optional)">

            <textarea
              v-clipboard="pem"
              v-tippy="'Click to copy.'"
              :value="pem"
              readonly
              class="h-40 input" />
          </div>
        </Field>

        <!-- Protobuf -->
        <Field
          v-show="section === 'protobuf'"
          title="Protobuf"
          description="This is your private key in a recognizable format for IPFS."
          hint="`Identity.PrivKey` in the IPFS node configuration.">
          <textarea
            ref="protobuf"
            v-clipboard="protobuf"
            v-tippy="'Click to copy.'"
            :value="protobuf"
            readonly
            class="h-40 input" />
        </Field>

        <!-- Key File -->
        <Field v-show="section === 'file'" title="Key File" description="Download your private key and keep it secure on your device.">
          <div class="buttons">
            <Button class="button--primary" @click="download">
              Download
            </Button>
          </div>
        </Field>

        <!-- Base64 -->
        <Field
          v-show="section === 'base64'"
          title="Base64"
          description="This is your base64-encoded private key.">
          <textarea
            v-clipboard="base64"
            v-tippy="'Click to copy.'"
            :value="base64"
            readonly
            class="h-40 input" />
        </Field>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <Button class="button--danger button--sm" @click="close">
            Close
          </Button>
        </div>
      </template>
    </Box>
  </dialog>
</template>

<script lang="ts">
import { debounce, DebouncedFunc, noop } from 'lodash'
import Dialog from '~/mixins/Dialog'

interface IData {
  section: 'pem' | 'protobuf' | 'file' | 'base64'
  password: string
  pem: string
  generatePEM: DebouncedFunc<any>
}

export default Dialog.extend({
  data: (): IData => ({
    section: 'pem',
    password: '',
    pem: '',
    generatePEM: debounce(noop)
  }),

  computed: {
    categories() {
      return {
        PEM: 'pem',
        Protobuf: 'protobuf',
        'Key File': 'file',
        Base64: 'base64'
      }
    },

    protobuf(): string {
      return this.$ipfs.privateKey?.toProtobuf() || ''
    },

    base64(): string {
      return Buffer.from(this.$ipfs.privateKey?.marshal || '').toString('base64')
    }
  },

  created() {
    this.generatePEM = debounce(this._generatePEM, 400)
    this.generatePEM()
  },

  watch: {
    password() {
      this.generatePEM()
    }
  },

  methods: {
    _generatePEM() {
      this.pem = this.$ipfs.privateKey?.toPem({ type: 'protobuf', password: this.password }) || ''
    },

    download() {
      this.$ipfs.privateKey?.download()
    }
  }
})
</script>
