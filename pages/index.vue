<template>
  <div class="home">
    <!-- Hero -->
    <HomeHero />

    <!-- Categories -->
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
  @apply space-y-24;
}

.home__hero {
  @apply text-center;
}

.home__content {
  @apply space-y-9 mx-auto max-w-prose;
}
</style>
