<template>
  <div class="share">
    <!-- Categories -->
    <ButtonsMenu v-model="category" class="share__categories" :data="categories" />

    <!-- Upload -->
    <ShareUpload v-show="category === 'upload'" />

    <!-- Open CID -->
    <ShareCID v-show="category === 'cid'" />

    <!-- Open IPNS -->
    <ShareCID v-show="category === 'ipns'" />

    <!-- Open DNSLink -->
    <ShareDNSLink v-show="category === 'dnslink'" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

interface IData {
  category: 'upload' | 'cid' | 'ipns' | 'dnslink'
}

export default Vue.extend({
  data: (): IData => ({
    category: 'upload'
  }),

  computed: {
    categories() {
      return {
        Upload: 'upload',
        CID: 'cid',
        // IPNS: 'ipns',
        DNSLink: 'dnslink'
      }
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
