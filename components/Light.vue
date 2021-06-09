<template>
  <div class="light">
    <div v-if="ping && value" class="light__ping" :class="lightCss" />
    <div class="light__dot" :class="lightCss" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    value: {
      type: Boolean,
      default: false
    },
    ping: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    lightCss(): any {
      return {
        light__on: this.value,
        light__off: !this.value
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.light {
  @apply flex relative;
  width: 10px;
  height: 10px;
}

.light__ping {
  @apply animate-ping absolute inline-flex rounded-full opacity-75 h-full w-full;

  &.light__on {
    @apply bg-success;
  }

  &.light__off {
    @apply bg-danger;
  }
}

.light__dot {
  @apply rounded-full h-full w-full;

  &.light__on {
    @apply bg-success;
  }

  &.light__off {
    @apply bg-danger;
  }
}
</style>
