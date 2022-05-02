<template>
  <div class="open">
    <form v-if="$ipfs.ready" class="space-y-3" @submit.prevent="open()">
      <input
        v-model="dnslink"
        placeholder="www.dreamlink.cloud"
        class="input"
        required>

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
import Swal from 'sweetalert2'
import queryString, { ParsedQuery } from 'query-string'

export default Vue.extend({
  data: () => ({
    dnslink: '',
    filename: ''
  }),

  methods: {
    async open() {
      try {
        const cidPath = await this.$ipfs.api.dns(this.dnslink) as string
        const cid = cidPath.substring(6)

        const query: ParsedQuery = {
          cid,
          filename: this.filename
        }

        // Reload the page to get better results
        document.location.href = '/explorer?' + queryString.stringify(query, { skipNull: true })
      } catch (err) {
        Swal.fire({
          title: 'A problem has occurred',
          text: 'No DNS records linked to an IPFS object found.',
          icon: 'error'
        })
      }
    }
  }
})
</script>
