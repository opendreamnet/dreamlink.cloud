<template>
  <div class="status">
    <!-- Button -->
    <Button
      v-tippy
      title="My node"
      el="NuxtLink"
      to="/app/profile"
      class="status__button button--sm">
      <!-- Light status -->
      <Light v-model="$ipfs.started" />

      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>IPFS</title><path d="M12 0L1.608 6v12L12 24l10.392-6V6zm-1.073 1.445h.001a1.8 1.8 0 002.138 0l7.534 4.35a1.794 1.794 0 000 .403l-7.535 4.35a1.8 1.8 0 00-2.137 0l-7.536-4.35a1.795 1.795 0 000-.402zM21.324 7.4c.109.08.226.147.349.201v8.7a1.8 1.8 0 00-1.069 1.852l-7.535 4.35a1.8 1.8 0 00-.349-.2l-.009-8.653a1.8 1.8 0 001.07-1.851zm-18.648.048l7.535 4.35a1.8 1.8 0 001.069 1.852v8.7c-.124.054-.24.122-.349.202l-7.535-4.35a1.8 1.8 0 00-1.069-1.852v-8.7c.124-.054.24-.122.35-.202z" /></svg>

      <!-- Download
      <span v-if="download">{{ download | prettyBytes }}/s</span>-->

      <!-- Upload
      <span v-if="upload">{{ upload | prettyBytes }}/s</span>-->
    </Button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { BWResult } from 'ipfs-core-types/dist/src/stats/index'
import { isNil } from 'lodash'

interface IData {
  payload: BWResult | null
  fetchInterval: NodeJS.Timeout | null
}

export default Vue.extend({
  data: (): IData => ({
    payload: null,
    fetchInterval: null
  }),

  computed: {
    avatarURL(): string {
      return this.$accessor.ipfs.avatarURL
    },

    download(): number | null {
      const value = this.payload?.rateIn
      return isNil(value) || isNaN(value) ? null : value
    },

    upload(): number | null {
      const value = this.payload?.rateOut
      return isNil(value) || isNaN(value) ? null : value
    }
  },

  created() {
    // this.fetchInterval = setInterval(this.fetchSpeed.bind(this), 2000)
  },

  methods: {
    async fetchSpeed() {
      if (!this.$ipfs.started) {
        return
      }

      if (!this.$ipfs.api) {
        throw new Error('IPFS API is undefined!')
      }

      for await (const data of this.$ipfs.api.stats.bw()) {
        this.payload = data
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.status {
  @apply w-full;

  @screen md {
    @apply w-auto;
  }

  &:deep(.dropdown-menu) {
    min-width: 315px;
  }

  /*
  &::v-deep {
    .dropdown-menu {
      min-width: 315px;
    }
  }
  */
}

.status__button {
  @apply gap-2 relative w-full;

  svg {
    @apply inline-block;
    fill: #65C2CB;
    height: 22px;
  }
}

.status__id {
  .input {
    @apply text-xs font-semibold;
  }
}

.status__details {
  @apply flex gap-3;

  figure img {
    @apply max-w-none;
    width: 80px;
    height: 80px;
    margin-left: -6px;
    margin-top: -6px;
  }

  .status__details__right {
    @apply flex-1 break-all;
  }

  .status__identity__id {
    @apply text-center;
  }
}
</style>
