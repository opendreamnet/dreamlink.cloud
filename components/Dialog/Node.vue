<template>
  <dialog ref="dialog" class="dialog">
    <Box title="My IPFS Node">
      <div v-if="$ipfs.ready" class="node__cols">
        <!-- Avatar -->
        <div class="node__left">
          <figure>
            <img :src="avatarURL">
          </figure>
        </div>

        <!-- Details -->
        <div class="prose node__right node__details">
          <p>
            <span class="title">
              <Tooltip :content="{ content: 'A Peer ID is how each unique IPFS node is identified on the network. The Peer ID is created when the IPFS node is initialized and is essentially a cryptographic hash of the node\'s public key.', appendTo: $el }" />
              Peer ID:
            </span>
            <span class="value">{{ $ipfs.identity.id }}</span>
          </p>

          <p>
            <span class="title">
              <Tooltip :content="{ content: 'The space occupied by your files. The maximum amount depends on your web browser and the correct amount is not always displayed (it is usually higher).', appendTo: $el }" />
              Storage:
            </span>
            <NetworkStorageSize class="value" />
          </p>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="$ipfs.error">
        <p>An error occurred while trying to start the IPFS node, please refresh the page or try another web browser:</p>
        <pre class="pre"><code>{{ $ipfs.error }}</code></pre>
      </div>

      <!-- Loading -->
      <div v-else>
        <p>Your node is starting up, wait a minute....</p>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <Button class="button--danger button--sm" @click="close">
            Close
          </Button>

          <Button
            v-if="$ipfs.ready" v-tooltip="storageTooltip" class="button--primary button--sm"
            :loading="gcLoading" @click="freeUp">
            Free up storage
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
    gcLoading: false
  }),

  computed: {
    avatarURL(): string {
      let seed = ''

      if (this.$ipfs.ready && this.$ipfs.identity) {
        seed = this.$ipfs.identity.id
      }

      return `https://avatars.dicebear.com/api/micah/${seed}.svg?mouth[]=laughing&mouth[]=nervous&mouth[]=smile&glassesProbability=80&width=130&height=130`
    },

    storageTooltip() {
      if (!this.$el) {
        return null
      }

      return { content: 'Delete and stop distributing all files you have uploaded in the past.', appendTo: this.$el }
    }
  },

  mounted() {
    this.$bus.on('node.dialog', this.open)
  },

  beforeDestroy() {
    this.$bus.off('node.dialog', this.open)
  },

  methods: {
    async freeUp() {
      this.gcLoading = true

      let count = 0

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for await (const data of this.$ipfs.api.repo.gc()) {
        count += 1
      }

      // eslint-disable-next-line no-console
      console.log(count, 'objects have been deleted successfully.')

      this.$bus.emit('node.gc')
      this.gcLoading = false
    }
  }
})
</script>

<style lang="scss" scoped>
.node__cols {
  @apply flex gap-6;
}

.node__right {
  @apply flex-1 break-all;
}

.node__details {
  .title {
    @apply block;
  }

  .value {
    @apply text-sm text-snow;
  }
}
</style>
