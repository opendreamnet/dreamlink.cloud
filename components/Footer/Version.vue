<template>
  <!-- With Github -->
  <p v-if="$config.app.githubUrl">
    <a :href="$config.app.githubUrl" target="_blank" class="version hover:underline hover:text-primary-lighten">
      v{{ $config.version }}
    </a>
  </p>

  <!-- Just version -->
  <p v-else>
    <span class="version">
      v{{ $config.version }}
    </span>
  </p>
</template>

<style lang="scss" scoped>
.version {
  @apply font-bold text-white;
}
</style>
