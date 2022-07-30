<template>
  <FilesExplorer :entries="entries" :loading="loading" @reload="fetchEntries" />
</template>

<script lang="ts">
import Vue from 'vue'
import type { Entry } from '@opendreamnet/ipfs'

interface IData {
  entries: Entry[]
  loading: boolean
  errorMessage: string | null
}

export default Vue.extend({
  props: {
    path: {
      type: String,
      default: '/.dreamlink'
    }
  },

  data: (): IData => ({
    loading: false,
    entries: [],
    errorMessage: null
  }),

  watch: {
    path: {
      handler() {
        this.fetchEntries()
      },
      immediate: true
    }
  },

  methods: {
    async fetchEntries() {
      this.loading = true

      try {
        const entry = await this.$ipfs.fromMFS(this.path, {
          stats: true,
          subentries: true,
          cache: 'explorer'
        })

        await entry.waitUntil('loaded')

        this.entries = []

        if (entry.type === 'file') {
          this.entries.push(entry)
        } else {
          this.entries.push(...entry.subEntries!)
        }
      } catch (err: any) {
        if (err.message === 'file does not exist') {
          return
        }

        this.errorMessage = err.message

        console.trace(err)
      } finally {
        this.loading = false
      }
    }
  }
})
</script>
