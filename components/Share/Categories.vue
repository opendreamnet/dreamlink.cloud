<template>
  <div class="share">
    <!-- Categories -->
    <Tabs v-model="category" :tabs="categories" />

    <!-- Upload -->
    <ShareUpload v-show="category === 'upload'" />

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
  category: 'upload' | 'cid' | 'ipns' | 'dns-link'
}

export default Vue.extend({
  data: (): IData => ({
    category: 'upload'
  }),

  computed: {
    categories() {
      return [
        'Upload',
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
