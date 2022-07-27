<template>
  <p
    v-if="$accessor.ipfs.appCID"
    v-tippy
    v-clipboard="$accessor.ipfs.appCID"
    title="Current version. Click to copy."
    class="cid">
    {{ $accessor.ipfs.appCID }}
  </p>
</template>

<style lang="scss" scoped>
.cid {
  @apply text-xs text-snow-darken cursor-default;
}
</style>
