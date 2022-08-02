<template>
  <div class="open">
    <form v-if="$ipfs.started" class="space-y-6" @submit.prevent="open()">
      <input v-model="ipns" placeholder="IPNS" class="input" required>
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
import axios from 'axios'
import { ParsedQuery } from 'query-string'

export default Vue.extend({
  data: () => ({
    ipns: '',
    filename: ''
  }),

  methods: {
    /**
     * User wants to open a IPNS
     */
    async open() {
      try {
        if (!this.$ipfs.api) {
          throw new Error('IPFS API undefined!')
        }

        const { data } = await axios.get('https://ipfs.io/api/v0/name/resolve', {
          params: {
            arg: `/ipns/${this.ipns}`,
            recursive: true,
            'dht-timeout': '30000ms'
          }
        })

        const cid = data.Path.substring(6)

        const query: ParsedQuery = {
          cid,
          filename: this.filename
        }

        this.$router.push({
          path: '/explorer',
          query
        })
      } catch (err: any) {
        Swal.fire({
          title: 'A problem has occurred',
          text: err.message,
          icon: 'error'
        })
      }
    }
  }
})
</script>
