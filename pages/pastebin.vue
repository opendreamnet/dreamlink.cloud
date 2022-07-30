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
import Vue from 'vue'
import Swal from 'sweetalert2'

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

        const entry = await this.$ipfs.add(this.paste, { pin: true })
        const filename = this.filename || `${entry.cid.toString()}.txt`

        this.$accessor.pins.create({
          cid: entry.cid.toString(),
          name: filename,
          size: new Blob([this.paste]).size
        })

        this.$events.emit('upload.success')

        this.$router.push(`/explorer?cid=${entry.cid.toString()}&filename=${filename}`)
      } catch (err: any) {
        Swal.fire({
          title: 'A problem has occurred',
          text: err.message,
          icon: 'error'
        })
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
