<template>
  <div class="field">
    <div class="field__title" v-html="$md.render(title)" />

    <div v-if="description" class="field__description" v-html="$md.render(description)" />

    <div class="mt-5">
      <slot />
    </div>

    <div v-if="hint" class="field__hint" v-html="$md.render(hint)" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: null
    },
    hint: {
      type: String,
      default: null
    }
  }
})
</script>

<style lang="scss" scoped>
.field--danger {
  .field__title {
    @apply text-danger;
  }
}

.field__title {
  @apply font-semibold text-white;

  &::v-deep {
    p {
      @apply m-0;
    }
  }
}

.field__description {
  @apply max-w-prose font-light text-snow-dark;

  &::v-deep {
    p {
      @apply m-0;
    }

    strong {
      @apply font-bold text-white;
    }
  }
}

.field__hint {
  @apply text-sm text-snow-darker;
}
</style>
