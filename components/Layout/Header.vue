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

        <div v-tooltip="'Search for files or folders thanks to ipfs-search.com'" class="item" @click="$refs.searchDialog.open()">
          Search
        </div>

        <NuxtLink v-tooltip="'Create and share any text format.'" to="/pastebin" class="item">
          Pastebin
        </NuxtLink>

        <NuxtLink v-tooltip="'Create an encrypted P2P chat room for free communication between people you trust.'" to="/chat" class="item">
          Chat
        </NuxtLink>

        <NuxtLink to="/about" class="item">
          About
        </NuxtLink>
      </div>

      <div class="nav__right">
        <NetworkStatus />
      </div>
    </nav>

    <DialogSearch ref="searchDialog" />
  </header>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({

})
</script>

<style lang="scss" scoped>
.header {
  @apply border-b border-menus-light py-5 shadow-sm;
}

.nav {
  @apply flex flex-wrap items-center gap-6;
}

.nav__left {
  @apply flex-1;
}

.nav__center {
  @apply flex flex-wrap justify-between items-center gap-9;
}

.nav__right {
  @apply flex flex-1 justify-end items-center gap-6;
}

.logo {
  @apply text-white tracking-widest text-xl;
}

.item {
  @apply text-snow-darker transition-colors cursor-pointer;

  &:hover {
    @apply text-primary-light;
  }
}
</style>
