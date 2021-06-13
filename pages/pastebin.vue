<template>
  <div class="pastebin">
    <Box title="Pastebin" subtitle="Create texts in different formats and share them via IPFS.">
      <form class="pastebin__form" @submit.prevent="submit()">
        <p>
          <input v-model="filename" class="input" placeholder="Filename (Optional). Examples: text.txt, about.md or code.js">
          <span class="hint">Syntax Highlight in the output will depend on the file name.</span>
        </p>

        <p>
          <textarea v-model="paste" class="input" autofocus required />
          <span class="hint">Remember that things in IPFS cannot be deleted. Do not upload private information!</span>
        </p>

        <p>
          <Button :loading="loading">
            Create Paste
          </Button>
        </p>
      </form>
    </Box>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data: () => ({
    filename: null,
    paste: null,
    loading: false
  }),

  methods: {
    async submit() {
      try {
        this.loading = true

        const cid = await this.$ipfs.upload(this.paste, { pin: false })
        const filename = this.filename || `${cid}.txt`

        this.$router.push(`/explorer?cid=${cid}&filename=${filename}`)
      } catch (err) {

      } finally {
        this.loading = false
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.pastebin {

}

.pastebin__form {
  @apply space-y-3;

  textarea {
    @apply font-mono;
    min-height: 300px;
  }

  .hint {
    @apply text-xs;
  }
}
</style>
