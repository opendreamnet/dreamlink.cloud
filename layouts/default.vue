<template>
  <div class="layout">
    <!-- Header -->
    <LayoutHeader />

    <!-- Body -->
    <Nuxt class="container body" />

    <!-- Footer -->
    <LayoutFooter />

    <!-- Global Dialogs -->
    <LazyDialogNode />
    <LazyDialogSearch />
  </div>
</template>

<style lang="scss" scoped>
.layout {
  @apply space-y-10;

  @screen md {
    @apply space-y-20;
  }
}
</style>

<style lang="scss">
.hint {
  @apply text-xs text-snow-darker leading-3;
}

dialog {
  @apply border-none;
}

.container {
  @apply mx-auto px-2;
}
</style>
