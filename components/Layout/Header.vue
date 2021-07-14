<template>
  <header class="header">
    <nav class="container nav">
      <div class="nav__left">
        <div class="logo title">
          {{ $config.name || 'DreamLink' }}
        </div>
      </div>

      <div class="nav__center">
        <NuxtLink v-tooltip="'Share files or even folders on the network.'" to="/" class="item">
          Share
        </NuxtLink>

        <div v-tooltip="'Search for files or folders thanks to ipfs-search.com'" class="item" @click="$events.emit('dialog.search.open')">
          Search
        </div>

        <NuxtLink v-tooltip="'Create and share any text format.'" to="/pastebin" class="item">
          Pastebin
        </NuxtLink>

        <NuxtLink v-tooltip="'Create an encrypted P2P chat room for free communication between people you trust.'" to="/chat" class="item">
          Chat
        </NuxtLink>

        <NuxtLink to="/app/about" class="item">
          About
        </NuxtLink>
      </div>

      <div class="nav__right">
        <NetworkStatus />
      </div>
    </nav>
  </header>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({

})
</script>

<style lang="scss" scoped>
.header {
  @apply border-b border-menus py-5 px-3;
}

.nav {
  @apply flex flex-col items-center gap-6;

  @screen md {
    @apply flex-row;
  }
}

.nav__left {
  @apply flex-1;
}

.nav__center {
  @apply flex flex-wrap justify-between items-center gap-12;
}

.nav__right {
  @apply flex-1 w-full;
  @apply flex justify-end items-center gap-6;
}

.logo {
  @apply text-white tracking-widest text-xl;
}

.item {
  @apply text-snow-darker text-lg transition-colors cursor-pointer;

  @screen md {
    @apply text-base;
  }

  &:hover {
    @apply text-primary-light;
  }
}
</style>
