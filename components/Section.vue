<template>
  <div class="section">
    <div class="section__header">
      <div class="section__left">
        <div v-if="title" class="section__title">
          {{ title }}
        </div>

        <div v-if="subtitle" class="section__subtitle">
          {{ subtitle }}
        </div>
      </div>

      <div v-if="$slots.header" class="section__right">
        <slot name="header" />
      </div>
    </div>

    <div class="section__content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    title: {
      type: String,
      default: null
    },
    subtitle: {
      type: String,
      default: null
    }
  }
})
</script>

<style lang="scss" scoped>
.section {
  &:not(:last-of-type) {
    @apply border-b border-menus pb-12;
  }

  &:not(:first-of-type) {
    @apply pt-12;
  }
}

.section__header {
  @apply mb-14;
}

.section__title {
  @apply text-origin-lighten font-bold text-4xl;
}

.section__subtitle {
  @apply text-origin-darken;
}
</style>
