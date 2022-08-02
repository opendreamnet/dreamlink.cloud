<template>
  <div class="tabs">
    <div class="tabs__nav">
      <div
        v-for="item in tabsArray"
        :key="item.id"
        :data-id="item.id"
        class="tabs__item"
        :class="getClass(item)"
        @click="select(item.id)">
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { kebabCase, random, isString } from 'lodash'

export type TabId = string | number

export interface ITab {
  id: TabId
  label: string
  disabled: boolean
  hidden: boolean
}

export type TabType = string | Partial<ITab>

export default Vue.extend({
  props: {
    tabs: {
      type: [Array as () => TabType[]],
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    }
  },

  computed: {
    tabsArray(): ITab[] {
      return this.normalizeTabs(this.tabs)
    }
  },

  created() {

  },

  methods: {
    normalizeTabs(data: TabType[]): ITab[] {
      return data.map((item) => {
        if (isString(item)) {
          item = { label: item } as Partial<ITab>
        }

        return {
          id: item.id || item.label ? kebabCase(item.label) : random(0, 100),
          label: item.label || item.id || 'Unknown',
          disabled: item.disabled || false,
          hidden: item.hidden || false
        } as ITab
      })
    },

    stringArrayToTabs(data: string[]): ITab[] {
      return this.normalizeTabs(data.map(label => ({ label })))
    },

    getClass(item: ITab) {
      return {
        'tab--active': this.value === item.id,
        'tab--hidden': item.hidden,
        'tab--disabled': item.disabled
      }
    },

    select(value: TabId) {
      this.$emit('input', value)
    }
  }
})
</script>

<style lang="scss" scoped>
.tabs {
  @apply mb-10 overflow-x-auto;

  &.tabs--sm {
    .tabs__item {
      @apply text-sm;
      height: 40px;
    }
  }

  &.tabs--lg {
    .tabs__item {
      @apply text-lg;
      height: 56px;
    }
  }
}

.tabs__nav {
  @apply flex;
  box-shadow: inset 0 -1px 0 0 rgb(119 126 144 / 30%);
}

.tabs__item {
  @apply block font-semibold text-origin-dark transition-colors cursor-pointer;
  @apply border-b border-transparent;
  height: 48px;

  &:not(:last-child) {
    @apply mr-20;
  }

  &:hover {
    @apply text-origin-lighten;
  }

  &.tab--active {
    @apply text-origin-lighten border-origin-lighten;
  }
}
</style>
