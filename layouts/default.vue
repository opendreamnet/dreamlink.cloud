<template>
  <div class="layout">
    <LayoutHeader />

    <Nuxt class="container body" />

    <LayoutFooter />
  </div>
</template>

<style lang="scss" scoped>
.layout {
  @apply space-y-20;
}
</style>

<style lang="scss">
.hint {
  @apply text-xs text-snow-dark;
}

dialog {
  @apply border-none;
}

.container {
  @apply mx-auto px-2;
}
</style>
