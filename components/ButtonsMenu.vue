<template>
  <div class="menu">
    <Button v-for="(val, label) of data"
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

  .button {
    @apply flex-1 rounded-none bg-opacity-0 text-snow-darker border-t border-b border-menus-light;

    &.item--active,
    &:hover {
      @apply bg-opacity-60 text-snow;
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
