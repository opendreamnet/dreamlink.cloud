<template>
  <dialog class="dialog">
    <Box title="Export Private Key">
      <div class="space-y-12">
        <ButtonsMenu
          v-model="section"
          :data="{ 'PEM': 'pem', 'Protobuf': 'protobuf', 'Key File': 'file' }" />

        <!-- Key File -->
        <Field v-show="section === 'file'" title="Key File" description="Download your private key and keep it secure on your device.">
          <div class="buttons">
            <Button class="button--primary" @click="download">
              Download
            </Button>
          </div>
        </Field>

        <!-- PEM -->
        <Field v-show="section === 'pem'" title="PEM" description="This is the content of your key file.">
          <textarea ref="pem"
                    v-clipboard="pem"
                    v-tooltip="'Click to copy.'"
                    :value="pem"
                    readonly
                    class="h-40 input" />
        </Field>

        <!-- Protobuf -->
        <Field v-show="section === 'protobuf'"
               title="Protobuf"
               description="This is your private key in a recognizable format for IPFS."
               hint="If you have a IPFS node on your device you can recover your identity by placing this text in the configuration (`Identity.PrivKey`).">
          <textarea ref="protobuf"
                    v-clipboard="protobuf"
                    v-tooltip="'Click to copy.'"
                    :value="protobuf"
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
import Dialog from '~/mixins/Dialog'

export default Dialog.extend({
  data: () => ({
    section: 'pem'
  }),

  computed: {
    pem(): string {
      return this.$ipfs.privateKey?.toPem() || ''
    },

    protobuf(): string {
      return this.$ipfs.privateKey?.toProtobuf() || ''
    }
  },

  methods: {
    download() {
      this.$ipfs.privateKey?.downloadPem()
    }
  }
})
</script>
