<template>
  <div class="open">
    <form v-if="$ipfs.ready" class="space-y-3" @submit.prevent="open()">
      <input
        v-model="ipns"
        placeholder="IPNS"
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
import Swal from 'sweetalert2'
import queryString, { ParsedQuery } from 'query-string'

export default Vue.extend({
  data: () => ({
    ipns: '',
    filename: ''
  }),

  methods: {
    /**
     * User wants to open a IPNS
     */
    async openIPNS() {
      try {
        await this.$ipfs.api.ipns.startOnline()
        const cidPath = await this.$ipfs.api.ipns.resolve(`/ipns/${this.ipns}`, { timeout: 30000 }) as string

        console.log(cidPath)

        const cid = cidPath.substring(6)

        const query: ParsedQuery = {
          cid,
          filename: this.filename
        }

        // Reload the page to get better results
        document.location.href = '/explorer?' + queryString.stringify(query, { skipNull: true })
      } catch (err: any) {
        Swal.fire({
          title: 'A problem has occurred',
          text: err.message,
          icon: 'error'
        })

        console.warn(err)
      }
    }
  }
})
</script>
