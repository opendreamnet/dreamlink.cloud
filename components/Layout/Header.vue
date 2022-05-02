<template>
  <header eader class="header" :class="headerClass">
    <div class="container nav">
      <!-- Left (Logo) -->
      <nav class="nav__left">
        <NuxtLink to="/" class="logo title">
          {{ $config.name || 'DreamLink' }}
        </NuxtLink>
      </nav>

      <!-- Navigation -->
      <nav class="nav__center">
        <NuxtLink v-tooltip="'Share files and folders.'" to="/" class="item">
          Share
        </NuxtLink>

        <div v-tooltip="'Search files and folders thanks to ipfs-search.com'" class="item" @click="$events.emit('dialog.search.open')">
          Search
        </div>

        <NuxtLink v-tooltip="'Share any text format.'" to="/pastebin" class="item">
          Pastebin
        </NuxtLink>

        <NuxtLink v-tooltip="'Create an encrypted P2P chat room.'" to="/chat" class="item">
          Chat
        </NuxtLink>

        <NuxtLink to="/app/about" class="item">
          About
        </NuxtLink>
      </nav>

      <!-- Status/Account -->
      <nav class="nav__right">
        <NetworkStatus />
      </nav>
    </div>
  </header>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data: () => ({
    scrollTop: 0
  }),

  computed: {
    headerClass() {
      return {
        'header--scrolled': this.scrollTop > 80
      }
    }
  },

  mounted() {
    window.addEventListener('scroll', () => {
      // Get the scroll position
      this.scrollTop = window.pageYOffset || document.documentElement.scrollTop
    })
  }
})
</script>

<style lang="scss" scoped>
.header {
  @apply py-5 px-3 sticky top-0 z-50;
  @apply bg-background transition-shadow;
  transition-timing-function: ease-in-out;

  &.header--scrolled {
    @apply shadow-lg;
  }

  @supports (backdrop-filter: blur(8px)) {
    @apply backdrop-blur bg-opacity-95;
  }
}

.nav {
  @apply grid items-center gap-6;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:  "left right"
                        "center center";

  @screen md {
    grid-template-columns: 1fr auto 1fr;
    grid-template-areas: "left center right";
  }
}

.nav__left {
  grid-area: left;
}

.nav__center {
  @apply flex flex-wrap items-center justify-center gap-9;
  grid-area: center;
}

.nav__right {
  @apply flex items-center justify-end gap-9;
  grid-area: right;
}

.logo {
  @apply text-white tracking-widest text-xl;
}

.item {
  @apply text-snow-darker text-lg transition-colors cursor-pointer;

  @screen md {
    @apply text-base;
  }

  &:hover,
  &.nuxt-link-exact-active {
    @apply text-primary-light;
  }
}
</style>
