<template>
  <div class="share">
    <!-- Categories -->
    <Tabs v-model="category" :tabs="categories" />

    <!-- My Files / Upload -->
    <div v-show="category === 'my-files'">
      <!-- Upload -->
      <ShareUpload class="mb-10" />

      <!-- Root explorer -->
      <FilesFromMFS v-if="$ipfs.ready" />
    </div>

    <!-- Open CID -->
    <ShareCID v-show="category === 'cid'" />

    <!-- Open IPNS -->
    <ShareIPNS v-show="category === 'ipns'" />

    <!-- Open DNSLink -->
    <ShareDNSLink v-show="category === 'dns-link'" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

interface IData {
  category: 'my-files' | 'cid' | 'ipns' | 'dns-link'
}

export default Vue.extend({
  data: (): IData => ({
    category: 'my-files'
  }),

  computed: {
    categories() {
      return [
        'My Files',
        'CID',
        'IPNS',
        'DNSLink'
      ]
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
