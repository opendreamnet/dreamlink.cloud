<template>
  <div class="space-y-16">
    <Field title="Garbage collection" description="Frees up storage space by deleting all unpinned files.">
      <Button :loading="gcLoading || unpinAllLoading" @click="freeUpStorage">
        Start
      </Button>
    </Field>

    <Field title="Unpin all" description="Remove the pin from all your files." class="field--danger">
      <Button class="button--danger" :loading="unpinAllLoading" @click.prevent="unpinAll">
        Unpin all
      </Button>
    </Field>

    <Field title="Delete all" description="Remove the pin from all your files and then perform a garbage collection to empty your storage." class="field--danger">
      <Button class="button--danger" :loading="gcLoading || unpinAllLoading" @click.prevent="deleteAll">
        Delete all
      </Button>
    </Field>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data: () => ({
    gcLoading: false,
    unpinAllLoading: false
  }),

  methods: {
    async freeUpStorage() {
      this.gcLoading = true

      await this.$accessor.ipfs.freeUpStorage()

      this.gcLoading = false
    },

    async unpinAll() {
      this.unpinAllLoading = true

      await this.$accessor.pins.unpinAll()

      this.unpinAllLoading = false
    },

    async deleteAll() {
      await this.unpinAll()
      await this.freeUpStorage()
    }
  }
})
</script>
