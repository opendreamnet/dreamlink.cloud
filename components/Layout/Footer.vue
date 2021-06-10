<template>
  <footer class="footer">
    <nav class="nav">
      <NuxtLink to="/" class="item">
        Share
      </NuxtLink>

      <NuxtLink to="/docs/tos" class="item">
        Terms of Service
      </NuxtLink>

      <NuxtLink to="/docs/privacy" class="item">
        Privacy Policy
      </NuxtLink>
    </nav>

    <div class="footer__copyright">
      <p>© {{ new Date().getFullYear() }} OpenDreamNet. DreamLink is distributed under the <a href="./LICENSE.txt" target="_blank">GNU AGPLv3 license</a>.</p>
      <p><a href="https://github.com/opendreamnet/dreamlink.cloud" target="_blank" class="version">v{{ $config.version }}</a></p>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  @apply space-y-3;
}

.nav {
  @apply flex flex-wrap justify-center items-center w-full space-x-6;
  @apply px-6;

  @screen md {
    @apply px-0;
  }

  a:hover {
    @apply text-primary underline;
  }
}

.footer__copyright {
  @apply text-sm text-center pb-6;

  a {
    @apply underline;
  }
}

.version {
  @apply font-semibold;
}
</style>
