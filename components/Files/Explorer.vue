<template>
  <table v-if="!loading && entries.length > 0" class="files">
    <!-- Header -->
    <thead class="files__row files--header">
      <tr>
        <th scope="col" class="icon" />

        <th class="name">
          Name
        </th>

        <th class="pin">
          Pin Status
        </th>

        <th class="size">
          Size
        </th>

        <th class="date">
          Date
        </th>

        <th class="actions" />
      </tr>
    </thead>

    <!-- Files -->
    <tbody>
      <tr v-for="entry of entries" :key="entry.cid.toString()" class="files__row">
        <td data-label="" class="icon">
          <FontAwesomeIcon :icon="getIcon(entry.mimetype)" />
        </td>

        <td data-label="Name" class="name">
          <NuxtLink :to="{ path: '/explorer', query: { cid: entry.cid.toString(), name: entry.name }}" class="filename">
            {{ entry.name || 'Unknown' }}
          </NuxtLink>

          <p v-tippy v-clipboard="entry.cid.toString()" class="cid" title="Click to copy.">
            {{ entry.cid.toString() }}
          </p>
        </td>

        <td data-label="Pin Status" class="pin">
          <div class="pin__button" :class="{'pin--pinned': entry.pinned}" @click="togglePin(entry)">
            <FontAwesomeIcon icon="thumbtack" />
          </div>
        </td>

        <td data-label="Size" class="size">
          <span>{{ entry.size | prettyBytes }}</span>
        </td>

        <td data-label="Date" class="date">
          <span>{{ entry.mtime?.secs | secsToDateLocale }}</span>
        </td>

        <td data-label="" class="actions">
          <div class="lg:flex lg:justify-center">
            <Button v-tippy title="Delete" class="button--danger button--xs" @click="remove(entry)">
              <FontAwesomeIcon icon="trash-alt" />
            </Button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <div v-else-if="loading" class="flex justify-center">
    <Loading class="scale-150" />
  </div>

  <div v-else class="text-center">
    📂 We will show your files here when you upload one!
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { DateTime } from 'luxon'
import type { Entry } from '@opendreamnet/ipfs'
import { getTypeFromMime } from '~/modules/utils'

export default Vue.extend({
  filters: {
    secsToDateLocale(value?: number) {
      return value ? DateTime.fromSeconds(value).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY) : 'Unknown'
    }
  },

  props: {
    entries: {
      type: Array as () => Entry[],
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    /**
     * Returns the icon according to the file type.
     */
    getIcon(mimetype?: string): string {
      switch (getTypeFromMime(mimetype)) {
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

    async togglePin(entry: Entry) {
      if (entry.pinned) {
        await entry.unpin()
      } else {
        await entry.pin()
      }
    },

    remove(entry: Entry) {
      // Remove
      this.$accessor.ipfs.rm(entry.relpath)

      // Request reload of entries
      this.$emit('reload')
    }
  }
})
</script>

<style lang="scss" scoped>
.files {
  @apply w-full table-fixed p-0;

  tr {
    @apply p-1;
  }

  th,
  td {
    @apply p-3 text-left;
  }

  th {
    @apply text-origin-dark;
  }

  @media screen and (max-width: 1024px) {
    thead {
      @apply overflow-hidden p-0 absolute;
      height: 1px;
      width: 1px;
      margin: -1px;
    }

    tr {
      @apply block;

      &:not(:last-child) {
        @apply border-b border-menus;
        @apply pb-6;
      }

      &:not(:first-child) {
        @apply pt-6;
      }
    }

    td {
      @apply block text-right;

      &::before {
        @apply float-left font-bold;
        content: attr(data-label);
      }
    }

    .icon {
      @apply hidden;
    }
  }
}

.filename {
  @apply block text-origin-lighten;

  &:hover {
    @apply underline text-primary-light;
  }
}

.cid {
  @apply text-xs text-origin-darken cursor-pointer transition-colors;

  &:hover {
    @apply text-origin-dark;
  }
}

.icon {
  @apply text-xl;

  @screen lg {
    @apply w-16 text-center;
  }
}

.pin {
  svg {
    @apply text-3xl;
  }

  .pin__button {
    @apply opacity-30 cursor-pointer;

    &.pin--pinned {
      @apply opacity-100 text-primary-lighten;
    }
  }

  @screen lg {
    @apply w-20 text-center #{!important};

    svg {
      @apply text-xl;
    }
  }
}

.size {
  @screen lg {
    @apply w-32;
  }
}

.date {
  @screen lg {
    @apply w-40;
  }
}

.actions {
  @screen lg {
    @apply w-40;
  }
}

/*
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

  a {
    @apply text-white;

    &:hover {
      @apply text-primary underline;
    }
  }
}

.filename {
  @apply block text-sm text-origin-lighten;
}

.cid {
  @apply text-xs text-origin-darken;
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
*/
</style>
