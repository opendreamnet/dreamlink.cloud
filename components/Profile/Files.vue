<template>
  <div class="files">
    <div class="files__content">
      <!-- Header -->
      <div class="files__row files--header">
        <div class="icon" />

        <div class="name">
          <span>Name</span>
        </div>

        <div class="cid">
          <span>CID</span>
        </div>

        <div class="size">
          <span>Size</span>
        </div>

        <div class="date">
          <span>Date</span>
        </div>

        <div class="actions" />
      </div>

      <!-- Files -->
      <div v-if="$accessor.pins.items.length > 0">
        <div v-for="(item) of $accessor.pins.items" :key="item.cid" class="files__row">
          <div class="icon">
            <FontAwesomeIcon :icon="getIcon(item.name)" />
          </div>

          <div class="name">
            <NuxtLink :to="{ path: '/explorer', query: { cid: item.cid, filename: item.name }}" target="_blank">
              {{ item.name || 'Unknown' }}
            </NuxtLink>
          </div>

          <div class="cid">
            <InputPlus :value="item.cid" readonly input-class="input--xs" />
          </div>

          <div class="size">
            <span>{{ item.size | prettyBytes }}</span>
          </div>

          <div class="date">
            <span>{{ item.date | dateToLocale }}</span>
          </div>

          <div class="actions">
            <Button v-tippy="'Unpin'" class="button--danger button--xs" @click="unpin(item.cid)">
              <FontAwesomeIcon icon="heart-broken" />
            </Button>
          </div>
        </div>
      </div>

      <!-- No files -->
      <div v-else class="pt-6 text-center text-snow-dark">
        <p>
          It looks like you haven't pin any files, try
          <NuxtLink to="/" class="underline text-primary">
            uploading one
          </NuxtLink>. 😎
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getObjectType } from '~/modules/utils'

export default Vue.extend({
  methods: {
    /**
     * Returns the icon according to the file type.
     */
    getIcon (filename?: string): string {
      switch (getObjectType(filename)) {
        case 'directory':
          return 'folder'

        case 'video':
          return 'file-video'

        case 'audio':
          return 'file-audio'

        case 'image':
          return 'file-image'

        case 'text':
          return 'file-alt'

        case 'pdf':
          return 'file-pdf'

        default:
          return 'question'
      }
    },

    async unpin (cid: string) {
      await this.$accessor.pins.unpin(cid)
    }
  }
})
</script>

<style lang="scss" scoped>
.files__row {
  @apply flex items-center gap-x-6 px-3 overflow-x-auto;
  @apply border-menus-lighten;
  min-height: 60px;

  &:not(:last-child) {
    @apply border-b;
  }

  &.files--header {
    @apply border-b-2 font-semibold text-base;
    @apply text-white #{!important};
  }

  &:not(.files--header):hover {
    @apply bg-menus-light;
  }
}

.icon {
  @apply flex-shrink-0 w-10;
  @apply text-center text-xl;
}

.name {
  @apply w-96;

  a {
    @apply text-white;

    &:hover {
      @apply text-primary underline;
    }
  }
}

.cid {
  @apply hidden;
  width: 390px;

  @screen sm {
    @apply block;
  }
}

.size {
  @apply flex-shrink-0 w-20;
}

.date {
  @apply hidden flex-shrink-0 w-56;

  @screen md {
    @apply block;
  }
}

.actions {
  @apply w-20;
}
</style>
