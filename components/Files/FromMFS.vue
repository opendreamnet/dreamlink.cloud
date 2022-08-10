<template>
  <FilesExplorer :entries="entries" :loading="loading" @reload="fetchEntries" />
</template>

<script lang="ts">
import Vue from 'vue'
import type { Entry } from '@opendreamnet/ipfs'
import { $ } from '~/modules/bus'

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

  created() {
    $.on('files.explorer.update', this.onUpdate.bind(this))
  },

  beforeDestroy() {
    $.off('files.explorer.update', this.onUpdate.bind(this))
  },

  methods: {
    onUpdate(path: string) {
      if (this.path !== path) {
        return
      }

      this.fetchEntries()
    },

    async fetchEntries() {
      this.loading = true

      try {
        const entry = await this.$ipfs.fromMFS(this.path, {
          stats: true,
          subentries: true
        })

        await entry.waitUntil('loaded')

        this.entries = []

        if (entry.type === 'file') {
          this.entries.push(entry)
        } else {
          // Filter the directory itself (this only happens on external nodes)
          // TODO: Patch this on @opendreamnet/ipfs
          const subEntries = (entry.subEntries!).filter(e => !e.cid.equals(entry.cid))
          this.entries.push(...subEntries)
        }
      } catch (err: any) {
        if (err.message === 'file does not exist' || err.message.includes('does not exist')) {
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
