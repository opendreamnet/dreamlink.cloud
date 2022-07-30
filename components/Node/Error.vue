<template>
  <Notification v-if="nodeError" class="notification--danger error">
    <p>A problem occurred while trying to start the IPFS node:</p>
    <pre class="pre"><code>{{ message }}</code></pre>
  </Notification>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  computed: {
    nodeError(): Error | null {
      return this.$accessor.ipfs.nodeError
    },

    message(): string {
      if (!this.nodeError) {
        return ''
      }

      if (this.nodeError.message.includes('Failed to fetch')) {
        return 'The connection to the external node could not be established, make sure that the Endpoint is correct or change the node type to "Browser".'
      }

      return this.nodeError.toString()
    }
  }
})
</script>

<style lang="scss" scoped>
.error {
  @apply rounded-none;
}
</style>
