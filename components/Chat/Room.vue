<template>
  <div class="room">
    <!-- Room -->
    <Box>
      <template #header>
        <div class="room__header">
          <!-- Room Title -->
          <h2 class="title">
            <span class="icon"><FontAwesomeIcon icon="comments" /></span>
            <span>Room: #{{ roomId }}</span>
          </h2>

          <!-- Room Buttons -->
          <div class="flex gap-3">
            <!-- Peers -->
            <Button
              v-if="joined" v-tooltip="'Peers in the room.'" class="button--sm"
              @click="$refs.peersDialog.open()">
              <span class="icon"><FontAwesomeIcon icon="users" /></span>
              <span>{{ numPeers }}</span>
            </Button>

            <!-- Settings -->
            <Button
              v-if="joined" v-tooltip="'Settings'" class="button--sm"
              @click="$refs.settingsDialog.open()">
              <span class="icon"><FontAwesomeIcon icon="cog" /></span>
            </Button>

            <!-- About -->
            <Button v-tooltip="'About chat rooms'" class="button--sm" @click="$refs.aboutDialog.open()">
              <span class="icon"><FontAwesomeIcon icon="question" /></span>
            </Button>
          </div>
        </div>
      </template>

      <div v-if="$ipfs.ready && joined" ref="messages" class="room__body">
        <!-- No messages -->
        <div v-if="records.length === 0" class="pt-6 text-center text-snow-dark">
          <p>No messages received since you joined. 😅</p>
        </div>

        <!-- Messages -->
        <ChatMessage
          v-for="(record, it) of records" :key="it" :record="record"
          :secret-key="masterKey" />
      </div>

      <!-- IPFS Loading -->
      <div v-else class="flex justify-center">
        <Loading class="scale-150" />
      </div>

      <template #footer>
        <form class="room__input" @submit.prevent="sendMessage">
          <input
            v-model="message" class="input" :placeholder="`Message #${roomId}`"
            required>

          <Button :loading="messageLoading || !joined">
            Send
          </Button>
        </form>
      </template>
    </Box>

    <DialogChatPeers ref="peersDialog" :peers="peers" />
    <DialogChatAbout ref="aboutDialog" />
    <DialogChatSettings ref="settingsDialog" :secret-key.sync="masterKey" :room-id="roomId" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { DateTime } from 'luxon'
import Swal from 'sweetalert2'
import { toString, attempt } from 'lodash'
import queryString from 'query-string'
import { ChatRecord } from '~/types'
import { MAX_RECORDS, DEFAULT_ENCRYPTION_KEY } from '~/modules/defs'
import { encryptMessage } from '~/modules/utils'

interface PubsubMessage {
  data: Uint8Array
  from: string
  key: Uint8Array
  receivedFrom: string
  seqno: Uint8Array
  signature: Uint8Array
  topicIDs: string[]
}

interface Data {
  joined: boolean
  masterKey: string
  message: string
  messageLoading: boolean
  records: ChatRecord[]
  peers: string[]
  // eslint-disable-next-line no-undef
  peersTimeout: NodeJS.Timeout | null
}

export default Vue.extend({
  props: {
    roomId: {
      type: String,
      required: true
    },
    secretKey: {
      type: String,
      default: null
    },
    primary: {
      type: Boolean,
      default: false
    }
  },

  data: (): Data => ({
    joined: false,
    masterKey: DEFAULT_ENCRYPTION_KEY,
    message: '',
    messageLoading: false,
    records: [],
    peers: [],
    peersTimeout: null
  }),

  computed: {
    topic(): string {
      return `dreamlink.chat.${this.roomId}`
    },

    numPeers(): number {
      return this.peers.length + 1
    }
  },

  watch: {
    async roomID(value, old) {
      if (old) {
        await this.leave(old)
      }

      this.join()
    },

    masterKey(value: string) {
      if (!this.primary) {
        return
      }

      const newKey = btoa(value)
      const uri = queryString.parseUrl(location.href)

      if (uri.query.key === newKey) {
        return
      }

      uri.query.key = newKey

      history.pushState({}, '', queryString.stringifyUrl(uri, { sort: false, skipEmptyString: true, skipNull: true }))
    }
  },

  created() {
    this.setupMasterKey()
    this.join()
  },

  beforeDestroy() {
    this.leave()
  },

  methods: {
    setupMasterKey() {
      if (this.secretKey) {
        this.masterKey = this.secretKey
      } else {
        attempt(() => {
          this.masterKey = atob(toString(this.$route.query.key))
        })
      }

      if (this.masterKey.length === 0) {
        this.masterKey = DEFAULT_ENCRYPTION_KEY
      }
    },

    async join() {
      await this.$ipfs.waitUntilReady()

      if (this.joined) {
        throw new Error(`You have already joined a room: ${this.roomId}`)
      }

      try {
        await this.$ipfs.api.pubsub.subscribe(this.topic, this.onMessage.bind(this), {
          timeout: 5000
        })

        // gossipsub need this delay https://github.com/libp2p/go-libp2p-pubsub/issues/331
        await new Promise(resolve => setTimeout(resolve, 5000))

        this.joined = true

        await this.fetchPeers()
      } catch (err) {
        Swal.fire({
          title: 'A problem has occurred',
          text: err.message,
          icon: 'error'
        })
      }
    },

    async leave(roomID?: string) {
      if (!roomID) {
        roomID = this.roomId
      }

      console.log('leaveRoom', roomID)

      if (this.peersTimeout) {
        clearTimeout(this.peersTimeout)
        this.peersTimeout = null
      }

      await this.$ipfs.waitUntilReady()

      await this.$ipfs.api.pubsub.unsubscribe(`dreamlink.chat.${roomID}`)

      this.joined = false
    },

    async sendMessage() {
      if (this.message.length === 0 || !this.joined) {
        return
      }

      try {
        this.messageLoading = true

        const payload = encryptMessage(this.$settings.username, this.message, this.masterKey)

        await this.$ipfs.api.pubsub.publish(this.topic, payload)

        this.message = ''
      } catch (err) {
        Swal.fire({
          title: 'A problem has occurred',
          text: err.message,
          icon: 'error'
        })
      } finally {
        this.messageLoading = false
      }
    },

    onMessage(payload: PubsubMessage) {
      this.records.push({
        from: payload.from,
        date: DateTime.now(),
        data: new TextDecoder().decode(payload.data)
      })

      if (this.records.length > MAX_RECORDS) {
        // Delete the oldest.
        this.records.pop()
      }

      this.$nextTick(this.scrollChat)
    },

    async fetchPeers() {
      if (!this.joined) {
        return
      }

      try {
        this.peers = await this.$ipfs.api.pubsub.peers(this.topic, { timeout: 2000 })
      } catch (err) {
        console.warn(err)
      }

      this.peersTimeout = setTimeout(this.fetchPeers.bind(this), 2000)
    },

    scrollChat() {
      if (this.$refs.messages) {
        const el = this.$refs.messages as Element
        el.scrollTop = el.scrollHeight
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.room__header {
  @apply flex items-center;

  .title {
    @apply w-full;
  }
}

.room__body {
  @apply space-y-9 overflow-x-hidden overflow-y-auto;
  height: 500px;
}

.room__input {
  @apply flex;

  .button {
    @apply rounded-l-none;
  }
}
</style>
