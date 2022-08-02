<template>
  <div class="pastebin max-w-prose">
    <Section title="Pastebin" subtitle="Create and share any text format on IPFS.">
      <form v-if="$ipfs.started" class="pastebin__form" @submit.prevent="submit()">
        <Field title="Filename" hint="Syntax Highlight in the preview will depend on the file name.">
          <input v-model="filename" class="input" placeholder="(Optional)">
        </Field>

        <Field title="Content" hint="Remember that things in IPFS are public. Do not share private information!">
          <textarea v-model="paste" class="input pastebin__textarea" autofocus required />
        </Field>

        <p>
          <Button class="button--primary" :loading="loading">
            Create Paste
          </Button>
        </p>
      </form>

      <div v-else class="flex justify-center">
        <Loading class="scale-150" />
      </div>
    </Section>
  </div>
</template>

<script lang="ts">
import { DateTime } from 'luxon'
import Swal from 'sweetalert2'
import Vue from 'vue'
import { ParsedQuery } from 'query-string'
import type { DefaultNuxtLoading } from '@nuxt/types/app'

interface IData {
  filename: string | null
  paste: string | null
  loading: boolean
}

export default Vue.extend({
  data: (): IData => ({
    filename: null,
    paste: null,
    loading: false
  }),

  methods: {
    async submit() {
      if (!this.paste) {
        return
      }

      try {
        this.loading = true

        const filename = this.filename || `${DateTime.now().toFormat('kkkk-LL-dd_HH-mm')}.txt`
        const file = new File([this.paste], filename)

        // Upload to MFS
        const { cid } = await this.$accessor.ipfs.upload({
          files: [file],
          loading: this.$nuxt.$loading as DefaultNuxtLoading,
          path: '.pastebin'
        })

        this.$events.emit('upload.success')

        // Request caching on the most popular gateway
        // await this.$accessor.ipfs.finishUpload(cid)

        const query: ParsedQuery = {
          uploader: 'true', // More appropriate messages for the uploader
          cid,
          name: filename
        }

        // Open explorer
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

        console.trace(err)
      } finally {
        this.loading = false
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.pastebin__form {
  @apply space-y-8;
}

.pastebin__textarea {
  @apply font-mono;
  min-height: 400px;
}
</style>
