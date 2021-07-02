<template>
  <dialog ref="dialog" class="dialog">
    <Box title="File availability.">
      <div class="prose">
        <p>
          Files on the IPFS network need to be distributed by other nodes to remain available, similar to how Torrents work.
        </p>

        <p>
          If after waiting several minutes the file has not yet loaded, it is very likely that there is no node left that continues distributing it.
        </p>

        <p>
          If you are the uploader of this file:
        </p>

        <ul>
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
