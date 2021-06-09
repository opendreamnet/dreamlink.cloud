<template>
  <div class="plus">
    <div v-if="status !== null" class="rounded-l plus__box">
      <Light v-model="status" :ping="false" />
    </div>

    <input
      ref="input"
      :value="value"
      class="input"
      v-bind="$attrs"
      v-on="$listeners"
      @input="$emit('update', $event.target.value)"
    >

    <div v-if="copy" ref="copyButton" v-tooltip="'Copy'" class="plus__box plus__box--button" :data-clipboard-text="value">
      <FontAwesomeIcon icon="clone" />
    </div>

    <a v-if="open" v-tooltip="'Open'" :href="value" target="_blank" class="rounded-r plus__box plus__box--button">
      <FontAwesomeIcon icon="external-link-square-alt" />
    </a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ClipboardJS from 'clipboard'

export default Vue.extend({

  model: {
    prop: 'value',
    event: 'update'
  },
  props: {
    value: {},
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
    }
  },

  mounted() {
    if (this.copy && this.$refs.copyButton) {
      // eslint-disable-next-line no-new
      new ClipboardJS(this.$refs.copyButton as Element)
    }
  }
})
</script>

<style lang="scss" scoped>
.plus {
  @apply flex;
}

.plus__box {
  @apply bg-menus-dark px-3 shadow-sm transition-colors;
  @include centered();

  &.plus__box--button {
    @apply text-snow-darker cursor-pointer;

    &:hover {
      @apply text-snow-lighter bg-menus-light;
    }
  }
}

.input {
  @apply rounded-none;
}
</style>
