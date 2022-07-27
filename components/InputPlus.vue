<template>
  <div class="plus">
    <!-- Status -->
    <div v-if="status !== null" class="rounded-l plus__box">
      <Light v-model="status" :ping="false" />
    </div>

    <!-- Input -->
    <input
      ref="input"
      :value="value"
      class="input"
      :class="inputClass"
      v-bind="$attrs"
      v-on="$listeners"
      @input="$emit('update', $event.target.value)">

    <div
      v-if="copy"
      ref="copyButton"
      v-clipboard="value"
      v-tippy="'Copy'"
      class="plus__box plus__box--button">
      <FontAwesomeIcon icon="clone" />
    </div>

    <a
      v-if="open"
      v-tippy="'Open'"
      :href="value"
      target="_blank"
      class="rounded-r plus__box plus__box--button">
      <FontAwesomeIcon icon="external-link-square-alt" />
    </a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  model: {
    prop: 'value',
    event: 'update'
  },

  props: {
    value: {
      type: [String, Number, Boolean, Date],
      default: null
    },
    status: {
      type: Boolean,
      default: null
    },
    copy: {
      type: Boolean,
      default: true
    },
    open: {
      type: Boolean,
      default: false
    },
    inputClass: {
      type: [String, Object],
      default: null
    }
  }
})
</script>

<style lang="scss" scoped>
.plus {
  @apply flex;
}

.plus__box {
  @apply bg-menus-dark px-3 shadow-sm text-sm transition-colors;
  @apply border-input-dark border-t border-b border-r;
  @include centered();

  &.plus__box--button {
    @apply text-snow-darken cursor-pointer;

    &:hover {
      @apply text-snow-lighten bg-menus-light;
    }
  }
}

.input {
  @apply rounded-none;
}
</style>
