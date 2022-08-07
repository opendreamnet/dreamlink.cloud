<template>
  <footer class="footer">
    <div class="container">
      <!-- Copyright & Logos -->
      <div class="footer__left">
        <FooterVersion />

        <FooterCID />

        <FooterCopyright />
      </div>

      <div class="w-10 h-10" />

      <!-- Gateways -->
      <FooterMirrors v-if="$accessor.ipfs.appCID" class="nav" />

      <!-- IPFS -->
      <FooterIPFS class="nav" />

      <!-- Links -->
      <nav class="nav">
        <div class="font-bold text-origin-lighten item">
          {{ $config.name }}
        </div>

        <NuxtLink to="/docs/tos" class="item">
          Terms of Service
        </NuxtLink>

        <NuxtLink to="/docs/privacy" class="item">
          Privacy Policy
        </NuxtLink>

        <NuxtLink to="/docs/contact" class="item">
          Contact
        </NuxtLink>

        <a v-if="$config.app.githubUrl" :href="$config.app.githubUrl" target="_blank" class="item">
          Source code
        </a>
      </nav>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  @apply border-t-2 border-menus p-10;
  @apply mt-40 #{!important};

  @screen md {
    @apply text-sm;
  }

  .container {
    @apply flex flex-col-reverse justify-between gap-6;

    @screen lg {
      @apply flex-row;
    }
  }
}

.nav {
  @apply space-y-4;

  &:deep(.item) {
    @apply block font-semibold text-origin-darken;

    &:hover {
      @apply text-origin-lighten underline;
    }
  }
}
</style>
