
<template>
  <div v-if="$ipfs.started" class="header">
    <!-- Avatar -->
    <div class="header__avatar">
      <figure>
        <img :src="$accessor.ipfs.avatarURL">
        <Light v-model="$ipfs.started" v-tippy="'You are connected to the IPFS network!'" />
      </figure>
    </div>

    <!-- Identity -->
    <div class="header__identity">
      <!--
      <div class="username">
        {{ isLocalUser ? $accessor.settings.username : peerId }}
      </div>
      -->

      <div
        v-tippy
        v-clipboard="peerId"
        title="Peer ID: This is how your IPFS node is identified on the network. Essentially a cryptographic hash of the node's public key. Click to copy."
        class="peerid">
        <InputPlus :value="peerId" input-class="input--sm" />
      </div>
    </div>

    <div class="header__tags">
      <p v-tippy="'Pinned files.'">
        <span class="value">{{ $accessor.pins.items.length }}</span> Files
      </p>

      <p v-tippy="'Space occupied by pinned and unpinned files.'">
        <span class="value">{{ $storage.usage | prettyBytes }}</span>
      </p>
    </div>
  </div>

  <!-- Loading -->
  <div v-else class="flex justify-center">
    <Loading class="scale-150" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  computed: {
    peerId(): string | null {
      return this.$ipfs.identity?.id.toString() || null
    },

    avatarURL(): string | null {
      return this.$accessor.ipfs.avatarURL
    }
  }
})
</script>

<style lang="scss" scoped>
.header {
  @apply space-y-8;
}

.header__avatar {
  @apply flex justify-center;

  figure {
    @apply relative;
  }

  img {
    @apply rounded-full border-2 border-snow-darken;
    width: 100px;
    height: 100px;
  }

  .light {
    @apply absolute right-2 bottom-3 scale-150 transform;
  }
}

.header__identity {
  @apply space-y-1 text-center;

  .peerid {
    @apply text-origin-lighten font-bold text-xl cursor-pointer;
    @apply overflow-ellipsis overflow-hidden whitespace-nowrap break-words;
  }

  .username {
    @apply text-origin-darken font-semibold;
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
