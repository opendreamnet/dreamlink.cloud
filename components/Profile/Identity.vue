<template>
  <div class="space-y-16">
    <!-- Peer ID -->
    <Field title="Peer ID" description="This is how your IPFS node is identified on the network. Essentially a cryptographic hash of the node's public key.">
      <InputPlus :value="$ipfs.identity.id" readonly class="max-w-xl" />
    </Field>

    <!-- Peer Addresses -->
    <Field title="Peer Addresses" description="Other nodes can connect to yours using any of these addresses.">
      <InputPlus v-for="address of $ipfs.identity.addresses"
                 :key="address.toString()"
                 :value="address.toString()"
                 readonly
                 class="max-w-xl"
                 input-class="input--xs" />
    </Field>

    <Field title="Public Key" description="This is the key that is shared to the world to validate that information really comes from your IPFS node.">
      <Button @click.prevent="exportPublicKey">
        Download
      </Button>
    </Field>

    <Field title="Private Key" description="This is the key that **only you should have**, like a password, this key allows to perform actions on your behalf. You can export it to back up your identity or to use it in secure applications." class="field--danger">
      <div class="buttons">
        <Button @click="$refs.dialogIdentityExport.open()">
          Export
        </Button>

        <Button class="button--danger" @click="$refs.dialogIdentityImport.open()">
          Import
        </Button>
      </div>
    </Field>

    <Field title="New identity" description="Create a new random private key without losing your files." class="field--danger">
      <Button class="button--danger" @click.prevent="$refs.dialogIdentityCreate.ask()">
        New identity
      </Button>
    </Field>

    <LazyDialogIdentityExport ref="dialogIdentityExport" />
    <LazyDialogIdentityImport ref="dialogIdentityImport" />
    <LazyDialogIdentityCreate ref="dialogIdentityCreate" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Swal from 'sweetalert2'
import { noop } from 'lodash'

export default Vue.extend({
  data: () => ({
  }),

  async created() {
    await this.$ipfs.waitUntilReady()
  },

  methods: {
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

      this.$ipfs.publicKey.downloadPem()
    }
  }
})
</script>
`)
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
