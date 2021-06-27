<template>
  <div v-if="!$ipfs.ready" key="loading" class="chat">
    <div class="flex justify-center">
      <Loading class="scale-150" />
    </div>
  </div>

  <div v-else-if="!roomID" key="join" class="chat">
    <ChatJoin />
  </div>

  <div v-else key="room" class="chat">
    <ChatRoom ref="room" :room-id="roomID" :primary="true" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { toString } from 'lodash'

interface Data {
  roomID: string | null
}

export default Vue.extend({
  data: (): Data => ({
    roomID: null
  }),

  watch: {
    $route() {
      this.setup()
    }
  },

  created() {
    this.setup()
  },

  methods: {
    setup() {
      this.roomID = toString(this.$route.query.room)

      if (this.roomID.length === 0) {
        this.roomID = null
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.chat {
  @apply space-y-6;
}
</style>
