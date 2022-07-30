<template>
  <Section title="Node" subtitle="Settings on the communication with the IPFS network.">
    <form id="nodeForm" @submit.prevent="submit()">
      <!-- Type -->
      <Field title="Type" :description="typeDescription">
        <select v-model="type" class="max-w-xl input" required>
          <option value="browser">
            Browser
          </option>
          <option value="external">
            External
          </option>
        </select>
      </Field>

      <!-- Endpoint -->
      <Field v-if="type === 'external'" title="Endpoint" description="Where can we connect to your node?" :hint="`Remember to add <code>${origin}</code> to <code>API.HTTPHeaders.Access-Control-Allow-Origin</code> in your node configuration.`">
        <input v-model="endpoint" class="max-w-xl input" required>
      </Field>

      <div>
        <Button class="button--primary">
          Save
        </Button>
      </div>
    </form>
  </Section>
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

  computed: {
    origin(): string {
      return document.location.origin
    },

    typeDescription(): string {
      if (this.type === 'external') {
        return 'Use the IPFS node you have installed on your device and maintain a more reliable connection.'
      }

      return 'Use the IPFS node that we install in your web browser. Easy but may have reliability issues.'
    }
  },

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
