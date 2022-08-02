<template>
  <Section title="Identity" subtitle="The way your node is identified in the IPFS network.">
    <div v-if="$ipfs.started" class="space-y-16">
      <!-- Peer ID -->
      <Field title="Peer ID" description="This is how your IPFS node is identified on the network. Essentially a cryptographic hash of the node's public key.">
        <InputPlus :value="$ipfs.identity.id.toString()" readonly class="max-w-xl" />
      </Field>

      <!-- Peer Addresses -->
      <Field title="Peer Addresses">
        <div class="space-y-2">
          <InputPlus
            v-for="address of $ipfs.identity.addresses"
            :key="address.toString()"
            :value="address.toString()"
            readonly
            class="max-w-xl"
            input-class="input--xs" />
        </div>
      </Field>

      <Field title="Public Key" description="This is the key that is shared to the world to validate that information really comes from your IPFS node.">
        <Button @click.prevent="exportPublicKey">
          Download
        </Button>
      </Field>

      <Field v-if="!$accessor.settings.isExternalNode" title="Private Key" description="This is the key that **only you should have**, like a password, this key allows to perform actions on your behalf. You can export it to back up your identity or to use it in secure applications." class="field--danger">
        <div class="buttons">
          <Button @click="openIdentityExportDialog()">
            Export
          </Button>

          <Button class="button--danger" @click="openIdentityImportDialog()">
            Import
          </Button>
        </div>
      </Field>

      <Field v-else title="Private Key" description="IPFS does not allow us to access the private key of external nodes (for security reasons) so the private key and identity options are disabled." class="field--danger" />

      <Field v-if="!$accessor.settings.isExternalNode" title="New identity" description="Create a new random private key without losing your files." class="field--danger">
        <Button class="button--danger" @click.prevent="openIdentityCreateDialog()">
          New identity
        </Button>
      </Field>

      <Field v-if="!$accessor.settings.isExternalNode" title="Reset timeline" description="Reset your IPFS node deleting all files and creating a new identity." class="field--danger">
        <Button class="button--danger" @click.prevent="reset">
          Reset
        </Button>
      </Field>
    </div>

    <!-- Loading -->
    <div v-else class="flex justify-center">
      <Loading class="scale-150" />
    </div>
  </Section>
</template>

<script lang="ts">
import Vue from 'vue'
import Swal from 'sweetalert2'
import { noop } from 'lodash'
import DialogIdentityExport from '~/components/Dialog/Identity/Export.vue'
import DialogIdentityImport from '~/components/Dialog/Identity/Import.vue'
import DialogIdentityCreate from '~/components/Dialog/Identity/Create.vue'

export default Vue.extend({
  data: () => ({
  }),

  methods: {
    openIdentityExportDialog() {
      this.$modal.show(DialogIdentityExport)
    },

    openIdentityImportDialog() {
      this.$modal.show(DialogIdentityImport)
    },

    openIdentityCreateDialog(ask = true) {
      if (ask) {
        Swal.fire({
          icon: 'warning',
          title: 'Are you sure you want to get a new identity?',
          text: 'You will lose administrator access to your databases, boards and you will have to share your new identity with people you trust.',
          confirmButtonText: 'Yes',
          confirmButtonColor: '#BF616A',
          showCancelButton: true
        }).then((value) => {
          if (value.isConfirmed) {
            this.$modal.show(DialogIdentityCreate)
          }

          return value
        }).catch(noop)
      } else {
        this.$modal.show(DialogIdentityCreate)
      }
    },

    resetIdentity() {
      Swal.fire({
        icon: 'warning',
        title: 'Are you sure you want to get a new identity?',
        text: 'You will lose administrator access to your databases, boards and you will have to share your new identity with people you trust.',
        confirmButtonText: 'Yes',
        confirmButtonColor: '#BF616A',
        showCancelButton: true
      }).then((value) => {
        if (value.isConfirmed) {
          this.doResetIdentity()
        }

        return value
      }).catch(noop)
    },

    async doResetIdentity() {
      Swal.fire({
        title: 'Generating a new identity...',
        text: 'It won\'t take long.',
        showCancelButton: false,
        showConfirmButton: false,
        allowEscapeKey: false,
        allowOutsideClick: false
      })

      await this.$accessor.ipfs.resetIdentity()
    },

    exportPublicKey() {
      if (!this.$ipfs.publicKey) {
        return
      }

      this.$ipfs.publicKey.download()
    },

    reset() {
      Swal.fire({
        icon: 'warning',
        title: 'Are you sure you want to delete everything?',
        text: 'Your files, settings and identity will be lost forever.',
        confirmButtonText: 'Yes',
        confirmButtonColor: '#BF616A',
        showCancelButton: true
      }).then((value) => {
        if (value.isConfirmed) {
          this.doReset()
        }

        return value
      }).catch(noop)
    },

    async doReset() {
      Swal.fire({
        title: 'Resetting the timeline...',
        text: 'One moment please.',
        showCancelButton: false,
        showConfirmButton: false,
        allowEscapeKey: false,
        allowOutsideClick: false
      })

      // Unpin all and empty storage.
      await this.$accessor.pins.unpinAll()
      await this.$accessor.ipfs.freeUpStorage()

      // Reset settings
      await this.$accessor.settings.reset()

      Swal.close()

      this.openIdentityCreateDialog(false)
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
