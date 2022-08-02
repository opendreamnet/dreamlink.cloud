<template>
  <div class="layout">
    <!-- Header -->
    <LayoutHeader />

    <!-- IPFS error -->
    <NodeError />

    <!-- Body -->
    <Nuxt class="container body" />

    <!-- Footer -->
    <LayoutFooter />
  </div>
</template>

<style lang="scss" scoped>
.layout {
  @apply space-y-10;

  @screen md {
    @apply space-y-14;
  }
}
</style>

<style lang="scss">
.container {
  @apply mx-auto px-2;
}

.vm--overlay {
  background: rgba(0, 0, 0, 0.9) !important;
}

.vm--modal {
  @apply bg-transparent #{!important};
}
</style>
