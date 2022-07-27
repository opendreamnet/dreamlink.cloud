<template>
  <div class="copyright">
    <FooterCompanyLogo v-if="$config.company.logo" />

    <p>
      © {{ new Date().getFullYear() }} <a :href="$config.company.url" target="_blank">{{ $config.company.name }}</a>.
      Distributed under the <a href="https://github.com/opendreamnet/dreamlink.cloud/blob/master/LICENSE" target="_blank">GNU AGPLv3 license</a>.
    </p>

    <p>
      <a href="https://ipfs.io/" target="_blank">IPFS</a> is a trademark of <a href="https://protocol.ai/" target="_blank">Protocol Labs</a>.
    </p>
  </div>
</template>

<style lang="scss" scoped>
.copyright {
  @apply mt-14 space-y-4 text-origin-darken;

  a {
    @apply text-origin-dark;

    &:hover {
      @apply text-primary-light underline;
    }
  }
}
</style>
