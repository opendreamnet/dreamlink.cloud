<template>
  <p v-if="$config.company.url">
    <a :href="$config.company.url" target="_blank">
      <img :src="$config.company.logo" class="logo">
    </a>
  </p>

  <p v-else>
    <img :src="$config.company.logo" class="logo">
  </p>
</template>

<style lang="scss" scoped>
.logo {
  height: 40px;
}
</style>
