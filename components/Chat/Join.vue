<template>
  <Box title="Chat" subtitle="Create an encrypted P2P chat room for free communication between people you trust.">
    <form v-if="$ipfs.started" class="chat__form" @submit.prevent="submit">
      <p>
        <label class="label">Room ID:</label>
        <input v-model="roomID" class="input" required>
        <span class="hint">It can be whatever you want, the topic you will talk about or a super secret room name.</span>
      </p>

      <p>
        <label class="label">Encryption key:</label>
        <input v-model="secretKey" class="input" required>
        <span class="hint">Only users who have the same encryption key will be able to view your messages.</span>
      </p>

      <p>
        <Button>
          Enter
        </Button>
      </p>
    </form>

    <div v-else class="flex justify-center">
      <Loading class="scale-150" />
    </div>
  </Box>
</template>

<script lang="ts">
import Vue from 'vue'
import { faker } from '@faker-js/faker'

export default Vue.extend({
  data: () => ({
    roomID: '',
    secretKey: ''
  }),

  mounted() {
    this.secretKey = faker.datatype.string(20)
  },

  methods: {
    submit() {
      if (this.roomID.length === 0) {
        return
      }

      this.$router.push(`/chat?room=${this.roomID}&key=${btoa(this.secretKey)}`)
    }
  }
})
</script>

<style lang="scss" scoped>
.chat__form {
  @apply space-y-5;
}
</style>
