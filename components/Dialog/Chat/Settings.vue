<template>
  <dialog class="dialog">
    <Box title="Room Settings.">
      <form id="settingsForm" class="prose" @submit.prevent="submit()">
        <p>
          <label class="label">Room ID:</label>
          <input :value="roomId" class="input" readonly>
        </p>

        <p>
          <label class="label">Share URL:</label>
          <InputPlus readonly :value="shareURL" />
          <span class="hint">
            Chat rooms do not have moderation tools, we recommend sharing this link only to people you trust.
          </span>
        </p>

        <p>
          <label class="label">Username:</label>
          <input
            ref="username"
            :value="$accessor.settings.username"
            class="input"
            placeholder="Username"
            maxlength="20"
            required>
        </p>

        <p>
          <label class="label">Encryption Key:</label>
          <input
            ref="secretKey"
            :value="secretKey"
            class="input"
            required>
          <span class="hint">Only users who have the same encryption key will be able to view your messages.</span>
        </p>

        <p class="flex items-center gap-3">
          <span class="checkbox">
            <input
              id="ignoreInvalid"
              ref="ignoreInvalid"
              :value="true"
              :checked="$accessor.settings.ignoreInvalid"
              type="checkbox">
            <label for="ignoreInvalid" />
          </span>

          <span>Ignore invalid messages.</span>
        </p>

        <span class="hint">Ignore messages that have been sent with a different encryption key.</span>
      </form>

      <template #footer>
        <div class="flex justify-end gap-3">
          <Button form="settingsForm" class="button--primary">
            Save
          </Button>

          <Button type="button" class="button--danger" @click="close()">
            Close
          </Button>
        </div>
      </template>
    </Box>
  </dialog>
</template>

<script lang="ts">
import queryString from 'query-string'
import Dialog from '~/mixins/Dialog'
import { MAX_USERNAME_LENGTH } from '~/modules/defs'

export default Dialog.extend({
  props: {
    roomId: {
      type: String,
      required: true
    },
    secretKey: {
      type: String,
      default: ''
    }
  },

  computed: {
    shareURL(): string {
      const uri = queryString.parseUrl(location.href)

      // @ts-ignore
      uri.query.room = this.roomId
      uri.query.key = btoa(this.secretKey)

      return queryString.stringifyUrl(uri)
    }
  },

  methods: {
    submit() {
      // Encryption key
      this.$emit('update:secret-key', (this.$refs.secretKey as HTMLInputElement).value)

      // Username
      const username = (this.$refs.username as HTMLInputElement).value

      if (username.length <= MAX_USERNAME_LENGTH) {
        this.$accessor.settings.setUsername(username)
      }

      // Ignore invalid messages
      this.$accessor.settings.setIgnoreInvalid((this.$refs.ignoreInvalid as HTMLInputElement).checked)

      // Close dialog
      this.close()
    }
  }
})
</script>
