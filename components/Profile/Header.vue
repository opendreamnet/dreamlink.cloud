
<template>
  <div class="header">
    <!-- Photo -->
    <div class="header__avatar">
      <figure>
        <img :src="$accessor.ipfs.avatarURL">
        <Light v-model="$ipfs.started" v-tippy="'You are connected to the IPFS network!'" />
      </figure>
    </div>

    <div class="header__identity">
      <div
        v-if="isLocalUser"
        v-tippy="'Peer ID: This is how your IPFS node is identified on the network. Essentially a cryptographic hash of the node\'s public key. Click to copy.'"
        v-clipboard="peerId"
        class="peerid">
        {{ peerId }}
      </div>

      <div class="username">
        {{ isLocalUser ? $accessor.settings.username : peerId }}
      </div>
    </div>

    <div v-if="isLocalUser" class="header__tags">
      <p v-tippy="'Pinned files.'">
        <span class="value">{{ $accessor.pins.items.length }}</span> Files
      </p>

      <p v-tippy="'Space occupied by pinned and unpinned files.'">
        <span class="value">{{ $storage.usage | prettyBytes }}</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    peerId: {
      type: String,
      default: () => {
        return ''
      }
    }
  },

  computed: {
    isLocalUser(): boolean {
      return this.peerId === this.$ipfs.identity?.id.toString()
    },

    avatarURL(): string | null {
      return `https://avatars.dicebear.com/api/micah/${this.peerId}.svg?glassesProbability=80&width=130&height=130`
    }
  }
})
</script>

<style lang="scss" scoped>
.header {
  @apply space-y-9;
}

.header__avatar {
  @apply flex justify-center;

  figure {
    @apply relative;
  }

  img {
    @apply rounded-full border-2 border-snow-darken;
    width: 130px;
    height: 130px;
  }

  .light {
    @apply absolute right-4 bottom-3 scale-150 transform;
  }
}

.header__identity {
  @apply space-y-1 text-center;

  .peerid {
    @apply text-white font-bold text-xl cursor-pointer;
    @apply overflow-ellipsis overflow-hidden whitespace-nowrap break-words;
  }

  .username {
    @apply overflow-ellipsis overflow-hidden whitespace-nowrap break-words;
  }
}

.header__tags {
  @apply flex justify-center space-x-6;
  @apply text-sm text-snow-dark;

  p {
    @apply cursor-help;
  }

  .value {
    @apply text-white font-semibold;
  }
}
</style>
