<template>
  <dialog ref="dialog" class="dialog">
    <Box title="File availability.">
      <div class="prose">
        <p>
          If you are unable to view or download this file it is possible that there are no peers left on the network that are still distributing it.
        </p>

        <p>
          Files on the IPFS network need to be distributed by other nodes (peers) to remain available.
        </p>

        <p>
          If you are the uploader of this file:
        </p>

        <ul>
          <li>If you have just uploaded your file, wait a few minutes until it is distributed on the network.</li>
          <li>Try to keep your IPFS node active.</li>
          <li>Pin the file to a persistent node or on <a href="https://docs.ipfs.io/concepts/persistence/#pinning-services" target="_blank">pinning services</a>.</li>
        </ul>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <Button class="button--danger button--sm" @click="close">
            Close
          </Button>
        </div>
      </template>
    </Box>
  </dialog>
</template>

<script lang="ts">
import Dialog from '~/mixins/Dialog'

export default Dialog.extend({

})
</script>
