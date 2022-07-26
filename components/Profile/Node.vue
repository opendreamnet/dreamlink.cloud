<template>
  <form id="nodeForm" @submit.prevent="submit()">
    <Field title="Type" description="">
      <select v-model="type" class="max-w-xl input" required>
        <option value="browser">
          Browser
        </option>
        <option value="external">
          External
        </option>
      </select>
    </Field>

    <Field v-if="type === 'external'" title="Endpoint" description="">
      <input v-model="endpoint" class="max-w-xl input" required>
    </Field>

    <div class="justify-end buttons">
      <Button class="button--primary">
        Save
      </Button>
    </div>
  </form>
</template>

<script lang="ts">
import Vue from 'vue'
import { isNil } from 'lodash'

interface IData {
  type: 'browser' | 'external'
  endpoint: string
}

export default Vue.extend({
  data: (): IData => ({
    type: 'browser',
    endpoint: '/ip4/127.0.0.1/tcp/5001'
  }),

  created() {
    if (isNil(this.$accessor.settings.remoteEndpoint)) {
      this.type = 'browser'
    } else {
      this.type = 'external'
      this.endpoint = this.$accessor.settings.remoteEndpoint
    }
  },

  methods: {
    async submit() {
      if (this.type === 'browser') {
        this.$accessor.settings.setRemoteEndpoint(null)
      } else {
        this.$accessor.settings.setRemoteEndpoint(this.endpoint)
      }

      await this.$accessor.settings.save()

      document.location.reload()
    }
  }
})
</script>

<style lang="scss" scoped>
form {
  @apply space-y-16;
}
</style>
