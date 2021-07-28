<template>
  <div class="mx-auto prose">
    <Box>
      <div>
        <NuxtContent :document="document" />
      </div>
    </Box>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  async asyncData({ $content }) {
    const document = await $content('docs', 'report').fetch()

    return {
      document
    }
  }
})
</script>
