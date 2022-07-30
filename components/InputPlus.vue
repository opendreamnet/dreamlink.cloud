<template>
  <div class="plus">
    <!-- Status -->
    <div v-if="status !== null" class="plus__box">
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
      class="plus__box plus__box--button">
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
  @apply bg-button px-3 shadow-sm text-sm transition-colors;
  @include centered();

  &:first-child {
    @apply rounded-l-md;
  }

  &:last-child {
    @apply rounded-r-md;
  }

  &.plus__box--button {
    @apply text-snow-darken cursor-pointer;

    &:hover {
      @apply text-snow-lighten bg-menus-light;
    }
  }
}

.input {
  @apply rounded-none;

  &:first-child {
    @apply rounded-l-md;
  }
}
</style>
