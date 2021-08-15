<template>
  <Box>
    <template #header>
      <h2 class="title">
        <span class="icon"><FontAwesomeIcon icon="database" /></span>
        <span>Actions</span>
      </h2>
    </template>

    <div v-if="record" class="actions">
      <Button
        v-if="!record.isPinned"
        key="pin"
        v-tooltip="'Prevents the file from being deleted from your storage and keeps it in an easily accessible list in your profile.'"
        :loading="pinLoading"
        @click="pin">
        <span class="icon"><FontAwesomeIcon icon="heart" /></span>
        <span>Pin</span>
      </Button>

      <Button
        v-else
        key="unpin"
        v-tooltip="'This file no longer interests you and can be deleted from your storage.'"
        class="button--danger"
        :loading="unpinLoading"
        @click="unpin">
        <span class="icon"><FontAwesomeIcon icon="heart-broken" /></span>
        <span>Unpin</span>
      </Button>

      <Button
        v-if="!record.isDirectory"
        v-tooltip="'Download the file using your IPFS node. This file will start taking up space on your storage and you will also contribute to its distribution. The process may take several minutes if the file is not on your storage.'"
        :loading="nodeDownloadLoading"
        @click="nodeDownload">
        <span class="icon"><FontAwesomeIcon icon="save" /></span>
        <span>Download</span>
      </Button>
    </div>

    <div v-else-if="$ipfs.error" class="flex justify-center">
      <Button el="NuxtLink" to="/app/profile" class="button--danger">
        <span class="icon"><FontAwesomeIcon icon="exclamation-triangle" /></span>
        <span>IPFS Error</span>
      </Button>
    </div>

    <div v-else class="flex justify-center">
      <Loading class="scale-150" />
    </div>
  </Box>
</template>

<script lang="ts">
import Swal from 'sweetalert2'
import NetworkObject from '~/mixins/NetworkObject'

export default NetworkObject.extend({
  data: () => ({
    pinLoading: false,
    unpinLoading: false
  }),

  methods: {
    async pin() {
      try {
        this.pinLoading = true

        await this.$accessor.pins.pin({
          cid: this.cid,
          name: this.filename,
          size: this.record?.size
        })

        if (this.record) {
          this.record.isPinned = true
        }
      } catch (err) {
        Swal.fire('Error', err.message, 'error')
      } finally {
        this.pinLoading = false
      }
    },

    async unpin() {
      try {
        this.unpinLoading = true

        await this.$accessor.pins.unpin(this.cid)

        if (this.record) {
          this.record.isPinned = false
        }
      } catch (err) {
        Swal.fire('Error', err.message, 'error')
      } finally {
        this.unpinLoading = false
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.actions {
  @apply space-y-6;

  .button {
    @apply block w-full;
  }
}
</style>
