<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__copyright">
        <p>
          <a href="https://github.com/opendreamnet/dreamlink.cloud" target="_blank" class="version">v{{ $config.version }}</a>
        </p>

        <p>
          © {{ new Date().getFullYear() }} <a href="https://opendreamnet.com" target="_blank">OpenDreamNet</a>. Distributed under the <a href="https://github.com/opendreamnet/dreamlink.cloud/blob/master/LICENSE" target="_blank">GNU AGPLv3 license</a>.
        </p>

        <p>
          <a href="https://ipfs.io/" target="_blank">IPFS</a> is a trademark of <a href="https://protocol.ai/" target="_blank">Protocol Labs</a>.
        </p>
      </div>

      <div class="w-16 h-16" />

      <nav class="nav">
        <NuxtLink to="/docs/tos" class="item">
          Terms of Service
        </NuxtLink>

        <NuxtLink to="/docs/privacy" class="item">
          Privacy Policy
        </NuxtLink>

        <a href="mailto:hello@opendreamnet.com" class="item">
          Contact
        </a>

        <a href="https://twitter.com/opendreamnetdev" target="_blank" class="item">
          Twitter
        </a>
      </nav>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  @apply border-t border-menus p-10;
  @apply mt-40 #{!important};

  @screen md {
    @apply text-sm;
  }

  .container {
    @apply flex flex-col-reverse justify-between;

    @screen md {
      @apply flex-row;
    }
  }
}

.nav {
  @apply space-y-2;

  a {
    @apply block font-semibold text-white;

    &:hover {
      @apply text-primary underline;
    }
  }
}

.footer__copyright {
  p {
    @apply mb-1;
  }
  
  a {
    @apply text-white;

    &:hover {
      @apply text-primary underline;
    }
  }
}

.version {
  @apply font-semibold;
}
</style>
