<template>
  <div class="menu">
    <Button
      v-for="(val, label) of data"
      :key="val"
      :class="{ 'item--active': value === val }"
      @click.prevent="$emit('input', val)">
      {{ label }}
    </Button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    data: {
      type: Object as () => Record<string, any>,
      required: true
    },
    value: {
      type: [String, Number, Boolean],
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
.menu {
  @apply flex justify-between w-full;
  @apply overflow-x-auto;

  .button {
    @apply flex-1 rounded-none opacity-80 text-snow-darker border-menus-light;

    &.item--active,
    &:hover {
      @apply opacity-100 text-snow-lighter;
      background-color: var(--button-focus-bg-color);
    }

    &:hover {
      @apply shadow-none;
    }

    &:first-child {
      @apply border-l rounded-l;
    }

    &:last-child {
      @apply border-r rounded-r;
    }
  }
}
</style>
