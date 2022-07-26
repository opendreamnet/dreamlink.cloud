<template>
  <div class="open">
    <form v-if="$ipfs.started" class="space-y-3" @submit.prevent="open()">
      <input
        v-model="cid"
        placeholder="CID"
        class="input"
        required>

      <input v-model="filename" placeholder="File name (Optional)" class="input">

      <Button class="button--sm">
        Open
      </Button>
    </form>

    <!-- Loading -->
    <div v-else class="flex justify-center">
      <Loading class="scale-150" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import isIPFS from 'is-ipfs'
import Swal from 'sweetalert2'
import queryString, { ParsedQuery } from 'query-string'

export default Vue.extend({
  data: () => ({
    cid: '',
    filename: ''
  }),

  methods: {
    /**
     * User wants to open a CID
     */
    open() {
      if (!isIPFS.cid(this.cid)) {
        return Swal.fire({
          title: 'CID invalid',
          html: 'Please enter a valid IPFS CID.',
          icon: 'warning'
        })
      }

      const query: ParsedQuery = {
        cid: this.cid,
        filename: this.filename
      }

      // Reload the page to get better results
      this.$router.push({
        path: '/explorer',
        query
      })
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
