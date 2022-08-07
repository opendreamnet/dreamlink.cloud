<template>
  <div class="mx-auto prose">
    <Section>
      <NuxtContent :document="document" />
    </Section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  async asyncData({ $content, route, redirect }) {
    try {
      const document = await $content('docs', route.params.id).fetch()

      return {
        document
      }
    } catch (err: any) {
      if (err.message === 'Not Found') {
        redirect('/')
      }
    }
  }
})
</script>
