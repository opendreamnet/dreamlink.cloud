<template>
  <div class="header">
    <figure class="header__avatar">
      <img :src="$accessor.ipfs.avatarURL">
      <Light v-model="$ipfs.ready" v-tooltip="'You are connected to the IPFS network!'" />
    </figure>

    <div class="header__identity">
      <h1 class="username">
        {{ isLocalUser ? $accessor.settings.username : peerId }}
      </h1>

      <h2 v-if="isLocalUser"
          v-tooltip="'Peer ID: This is how your IPFS node is identified on the network. Essentially a cryptographic hash of the node\'s public key. Click to copy.'"
          v-clipboard="peerId"
          class="peerid">
        {{ peerId }}
      </h2>
    </div>

    <div v-if="isLocalUser" class="header__tags">
      <p v-tooltip="'Pinned files.'">
        <span class="value">{{ $accessor.pins.items.length }}</span> Files
      </p>

      <p v-tooltip="'Space occupied by pinned and unpinned files.'">
        <span class="value">{{ $storage.usage | prettyBytes }}</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ipfs } from '~/modules/ipfs'

export default Vue.extend({
  props: {
    peerId: {
      type: String,
      default: () => {
        return ipfs.identity.id
      }
    }
  },

  computed: {
    isLocalUser(): boolean {
      return this.peerId === this.$ipfs.identity.id
    },

    avatarURL(): string | null {
      return `https://avatars.dicebear.com/api/micah/${this.peerId}.svg?glassesProbability=80&width=130&height=130`
    }
  }
})
</script>

<style lang="scss" scoped>
.header {
  @apply flex flex-col items-center gap-9;
}

.header__avatar {
  @apply relative;

  img {
    @apply rounded-full border-2 border-snow-darker;
    width: 130px;
    height: 130px;
  }

  .light {
    @apply absolute right-4 bottom-3 scale-150 transform;
  }
}

.header__identity {
  @apply text-center;

  .username {
    @apply font-bold text-2xl text-white;
  }

  .peerid {
    @apply text-sm text-snow-darker cursor-default;
  }
}

.header__tags {
  @apply flex space-x-6;
  @apply text-sm text-snow-dark;

  p {
    @apply cursor-help;
  }

  .value {
    @apply text-white font-semibold;
  }
}
</style>
