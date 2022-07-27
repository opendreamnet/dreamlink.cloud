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
      <nav v-if="$accessor.ipfs.appCID" class="nav">
        <div class="font-bold item">
          Mirrors
        </div>

        <a href="https://www.dreamlink.cloud" target="_blank" class="item">
          dreamlink.cloud
        </a>

        <a :href="`https://dweb.link/ipfs/${$accessor.ipfs.appCID}`" target="_blank" class="item">
          dweb.link
        </a>

        <a :href="`https://infura-ipfs.io/ipfs/${$accessor.ipfs.appCID}`" target="_blank" class="item">
          infura-ipfs.io
        </a>

        <a :href="`ipfs://${$accessor.ipfs.appCID}`" target="_blank" class="item">
          ipfs://
        </a>
      </nav>

      <!-- IPFS -->
      <nav class="nav">
        <div class="font-bold item">
          IPFS
        </div>

        <a href="https://docs.ipfs.io/concepts/what-is-ipfs/" target="_blank" class="item">
          What is IPFS?
        </a>

        <a href="https://docs.ipfs.io/concepts/persistence/" target="_blank" class="item">
          What is a pinned file?
        </a>

        <a href="https://docs.ipfs.io/concepts/privacy/" target="_blank" class="item">
          Privacy
        </a>

        <a href="https://docs.ipfs.io/install/ipfs-companion/" target="_blank" class="item">
          Browser extension
        </a>

        <a href="https://docs.ipfs.io/install/ipfs-desktop/" target="_blank" class="item">
          Desktop app
        </a>
      </nav>

      <!-- Links -->
      <nav class="nav">
        <div class="font-bold item">
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

  a {
    @apply block font-semibold text-origin-darken;

    &:hover {
      @apply text-origin-lighten underline;
    }
  }
}
</style>
