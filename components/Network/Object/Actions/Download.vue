<template>
  <Button
    v-if="entry.type === 'file'"
    v-tippy
    title="Download the file using your IPFS node instead of a gateway."
    :loading="nodeDownloadLoading"
    @click="nodeDownload">
    <span class="icon"><FontAwesomeIcon icon="save" /></span>
    <span>Download</span>
  </Button>
</template>

<script lang="ts">
import Swal from 'sweetalert2'
import NetworkObject from '~/mixins/NetworkObject'

export default NetworkObject.extend({
})
</script>
