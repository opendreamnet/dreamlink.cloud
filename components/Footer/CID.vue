<template>
  <p
    v-if="$accessor.ipfs.appCID"
    v-tippy="`Current version CID. Click to copy.`"
    v-clipboard="$accessor.ipfs.appCID"
    class="cid">
    {{ $accessor.ipfs.appCID }}
  </p>
</template>

<style lang="scss" scoped>
.cid {
  @apply text-xs text-snow-darken cursor-default;
}
</style>
