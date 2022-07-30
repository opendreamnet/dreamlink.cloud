<template>
  <Section title="Settings">
    <p>
      Chat features will be back soon!
    </p>

    <!--
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

      <div class="justify-end buttons">
        <Button class="button--primary">
          Save
        </Button>
      </div>

      <LazyDialogIdentityCreate ref="dialogIdentityCreate" />
    </form>
    -->
  </Section>
</template>

<script lang="ts">
import Vue from 'vue'
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
    }
  }
})
</script>

<style lang="scss" scoped>
form {
  @apply space-y-16;
}
</style>
