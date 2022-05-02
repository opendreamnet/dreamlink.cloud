<template>
  <footer class="footer">
    <div class="container">
      <!-- Copyright -->
      <div class="footer__copyright">
        <p>
          <a href="https://github.com/opendreamnet/dreamlink.cloud/blob/master/CHANGELOG.md" target="_blank" class="version">v{{ $config.version }}</a>
        </p>

        <p
          v-if="$accessor.ipfs.webCID.length > 0"
          v-tooltip="`Current version CID. Click to copy.`"
          v-clipboard="$accessor.ipfs.webCID"
          class="cid">
          {{ $accessor.ipfs.webCID }}
        </p>

        <p>
          © {{ new Date().getFullYear() }} <a href="https://opendreamnet.com" target="_blank">OpenDreamNet</a>. Distributed under the <a href="https://github.com/opendreamnet/dreamlink.cloud/blob/master/LICENSE" target="_blank">GNU AGPLv3 license</a>.
        </p>

        <p>
          <a href="https://ipfs.io/" target="_blank">IPFS</a> is a trademark of <a href="https://protocol.ai/" target="_blank">Protocol Labs</a>.
        </p>
      </div>

      <div class="w-10 h-10" />

      <!-- Gateways -->
      <nav v-if="$accessor.ipfs.webCID.length > 0" class="nav">
        <div class="font-bold item">
          Mirrors
        </div>

        <a href="https://www.dreamlink.cloud" target="_blank" class="item">
          dreamlink.cloud
        </a>

        <a :href="`https://dweb.link/ipfs/${$accessor.ipfs.webCID}`" target="_blank" class="item">
          dweb.link
        </a>

        <a :href="`https://infura-ipfs.io/ipfs/${$accessor.ipfs.webCID}`" target="_blank" class="item">
          infura-ipfs.io
        </a>

        <a :href="`ipfs://${$accessor.ipfs.webCID}`" target="_blank" class="item">
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

        <a href="https://github.com/opendreamnet/dreamlink.cloud" target="_blank" class="item">
          Source code
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
    @apply flex flex-col-reverse justify-between gap-6;

    @screen lg {
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
  @apply space-y-1;

  a {
    @apply text-white;

    &:hover {
      @apply text-primary underline;
    }
  }

  .version {
    @apply font-semibold;
  }

  .cid {
    @apply text-xs text-snow-darker cursor-default;
    @apply mb-6 #{!important};
  }
}
</style>
