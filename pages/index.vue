<template>
  <div class="home">
    <!-- Hero -->
    <div class="home__hero">
      <h1 class="mb-2 text-4xl font-bold title">
        Share files using <span class="text-ipfs">IPFS</span>
      </h1>

      <h2 class="text-lg text-snow-dark">
        File storage controlled by you, free and censorship-proof in a decentralized network.
      </h2>
    </div>

    <ShareCategories class="home__content" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
})
</script>

<style lang="scss" scoped>
.home {
  @apply space-y-20;
}

.home__hero {
  @apply text-center;
}

.home__content {
  @apply space-y-9 mx-auto max-w-prose;
}
</style>
