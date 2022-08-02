<template>
  <Box v-if="privateKey" title="New Identity">
    <div class="identity">
      <div class="identity__header">
        <h1 class="title">
          Congratulations, you are now:
        </h1>

        <h2 class="peerid">
          {{ privateKey.peerId }}
        </h2>

        <figure class="avatar">
          <img :src="avatarURL">
        </figure>
      </div>

      <Field title="Protobuf" description="Keep the following string in a safe place, this will allow you to recover your new identity.">
        <textarea
          v-clipboard="protobuf"
          v-tippy="'Click to copy.'"
          :value="protobuf"
          readonly
          class="h-20 input" />
      </Field>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <Button class="button--danger button--sm" @click="reload">
          Close
        </Button>
      </div>
    </template>
  </Box>

  <Box v-else title="Creating new identity...">
    <div class="flex justify-center">
      <Loading class="scale-150" />
    </div>
  </Box>
</template>

<script lang="ts">
import Vue from 'vue'
import Swal from 'sweetalert2'

interface Data {
  privateKey: PrivateKey | null
  protobuf: string | null,
  avatarURL: string
}

export default Vue.extend({
  data: (): Data => ({
    privateKey: null,
    protobuf: null,
    avatarURL: ''
  }),

  created() {
    this.run()
  },

  methods: {
    async run() {
      try {
        this.privateKey = await this.$accessor.ipfs.resetIdentity()
        this.protobuf = this.privateKey.toProtobuf()
        this.avatarURL = await this.$accessor.ipfs.fetchAvatarURL(this.privateKey.peerId)
      } catch (err: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message
        })
      }
    },

    reload() {
      location.reload()
    }
  }
})
</script>

<style lang="scss" scoped>
.identity {
  @apply space-y-9;
}

.identity__header {
  @apply flex flex-col items-center gap-y-9;
}

.title {
  @apply text-xl;
}

.avatar {
  img {
    @apply rounded-full border-2 border-snow-darken;
    height: 130px;
    width: 130px;
  }
}

.peerid {
  @apply  text-white;
  @apply overflow-ellipsis overflow-hidden whitespace-nowrap break-words;
}
</style>
