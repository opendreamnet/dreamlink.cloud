<template>
  <div class="pastebin">
    <Box title="Pastebin" subtitle="Create and share any text format on IPFS.">
      <form v-if="$ipfs.ready" class="pastebin__form" @submit.prevent="submit()">
        <p>
          <input v-model="filename" class="input" placeholder="File name (Optional)">
          <span class="hint">Syntax Highlight in the output will depend on the file name.</span>
        </p>

        <p>
          <textarea
            v-model="paste"
            class="input"
            autofocus
            required />
          <span class="hint">Remember that things in IPFS cannot be deleted. Do not share private information!</span>
        </p>

        <p>
          <Button :loading="loading">
            Create Paste
          </Button>
        </p>
      </form>

      <div v-else class="flex justify-center">
        <Loading class="scale-150" />
      </div>
    </Box>
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

        const cid = await this.$ipfs.upload(this.paste, { pin: true })
        const filename = this.filename || `${cid}.txt`

        this.$accessor.pins.create({
          cid,
          name: filename,
          size: new Blob([this.paste]).size
        })

        this.$events.emit('upload.success')

        this.$router.push(`/explorer?cid=${cid}&filename=${filename}`)
      } catch (err) {
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
  @apply space-y-5;

  textarea {
    @apply font-mono;
    min-height: 300px;
  }
}
</style>
