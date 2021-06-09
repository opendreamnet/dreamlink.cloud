<template>
  <header class="header">
    <nav class="nav">
      <div class="nav__left">
        <div class="logo title">
          {{ $config.name || 'DreamLink' }}
        </div>
      </div>

      <div class="nav__center">
        <NuxtLink to="/" class="item">
          Upload
        </NuxtLink>

        <NuxtLink to="/about" class="item">
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
  @apply bg-menus py-3 px-6 rounded-bl rounded-br shadow-lg;
}

.nav {
  @apply flex gap-6;
}

.nav__left {
  @apply flex-1;
}

.nav__center {
  @apply flex flex-wrap justify-between items-center gap-6;
}

.nav__right {
  @apply flex flex-1 justify-end items-center gap-6;
}

.logo {
  @apply text-2xl;
}

.item {
  @apply text-snow-light;

  &:hover {
    @apply text-primary;
  }
}
</style>
