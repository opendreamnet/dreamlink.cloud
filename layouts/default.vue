<template>
  <div class="container mx-auto">
    <LayoutHeader />

    <div class="body">
      <Nuxt />
    </div>

    <LayoutFooter />

    <script async defer data-domain="dreamlink.cloud" src="https://analytics.dreamnet.tech/js/script.js" />
  </div>
</template>

<style lang="scss" scoped>
.container {
  @apply space-y-20;
}
</style>
