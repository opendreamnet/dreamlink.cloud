<template>
  <Button
    v-if="!entry.pinned"
    key="pin"
    v-tippy
    title="Prevents the file from being automatically deleted from your node."
    :loading="loading"
    @click="pin">
    <span class="icon"><FontAwesomeIcon icon="heart" /></span>
    <span>Pin</span>
  </Button>

  <Button
    v-else
    key="unpin"
    class="button--danger"
    :loading="loading"
    @click="unpin">
    <span class="icon"><FontAwesomeIcon icon="heart-broken" /></span>
    <span>Unpin</span>
  </Button>
</template>

<script lang="ts">
import Swal from 'sweetalert2'
import NetworkObject from '~/mixins/NetworkObject'

export default NetworkObject.extend({
  data: () => ({
    loading: false
  }),

  methods: {
    async pin() {
      try {
        this.loading = true

        await this.entry.pin()
      } catch (err: any) {
        Swal.fire('Error', err.message, 'error')
      } finally {
        this.loading = false
      }
    },

    async unpin() {
      try {
        this.loading = true

        await this.entry.unpin()
      } catch (err: any) {
        Swal.fire('Error', err.message, 'error')
      } finally {
        this.loading = false
      }
    }
  }
})
</script>
