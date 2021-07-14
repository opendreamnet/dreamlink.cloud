<template>
  <form id="profileSettingsForm" @submit.prevent="submit()">
    <Field title="Change username" description="Usernames are **not** unique, please use the Peer ID to identify a user.">
      <input
        ref="username"
        :value="$accessor.settings.username"
        class="max-w-xl input"
        placeholder="Username"
        maxlength="20"
        required>
    </Field>

    <Field title="Ignore invalid messages">
      <div class="flex items-center gap-3">
        <span class="checkbox">
          <input
            id="ignoreInvalid"
            ref="ignoreInvalid"
            :value="true"
            :checked="$accessor.settings.ignoreInvalid"
            type="checkbox">
          <label for="ignoreInvalid" />
        </span>

        <span>Ignore messages that have been sent with a different encryption key.</span>
      </div>
    </Field>

    <Field title="Reset timeline" description="Reset your IPFS node deleting all files and creating a new identity." class="field--danger">
      <Button class="button--danger" @click.prevent="reset">
        Reset
      </Button>
    </Field>

    <div class="justify-end buttons">
      <Button class="button--primary">
        Save
      </Button>
    </div>

    <LazyDialogIdentityCreate ref="dialogIdentityCreate" />
  </form>
</template>

<script lang="ts">
import Vue from 'vue'
import Swal from 'sweetalert2'
import { noop } from 'lodash'
import { MAX_USERNAME_LENGTH } from '~/modules/defs'

export default Vue.extend({
  methods: {
    submit() {
      const username = (this.$refs.username as HTMLInputElement).value

      if (username.length <= MAX_USERNAME_LENGTH) {
        this.$accessor.settings.setUsername(username)
      }

      this.$accessor.settings.setIgnoreInvalid((this.$refs.ignoreInvalid as HTMLInputElement).checked)

      this.$accessor.settings.save()
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

      // @ts-ignore
      this.$refs.dialogIdentityCreate.run()
    }
  }
})
</script>

<style lang="scss" scoped>
form {
  @apply space-y-16;
}
</style>
