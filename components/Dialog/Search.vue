<template>
  <dialog ref="dialog" class="dialog">
    <Box>
      <div class="search">
        <form class="search__form" @submit.prevent="search">
          <input
            v-model="value" placeholder="Search..." class="flex-1 input input--lg"
            required>

          <select v-model="type" class="rounded-none input input--lg">
            <option value="any">
              Any
            </option>
            <option value="file">
              File
            </option>
            <option value="directory">
              Directory
            </option>
            <option value="text">
              Text
            </option>
            <option value="audio">
              Audio
            </option>
            <option value="video">
              Video
            </option>
            <option value="image">
              Image
            </option>
          </select>

          <Button :loading="loading" class="button--lg">
            Search
          </Button>
        </form>

        <div v-if="payload && payload.total > 0" class="search__results">
          <NuxtLink
            v-for="item in payload.hits" :key="item.hash" :to="{ path: '/explorer', query: { cid: item.hash, filename: item.title.replace( /(<([^>]+)>)/ig, '') } }"
            target="_blank" class="item">
            <div class="title" v-html="item.title" />

            <div class="extra">
              {{ item.size | prettyBytes }}  - {{ item['last-seen'] | toRelative }}
            </div>

            <div class="hash">
              {{ item.hash }}
            </div>
          </NuxtLink>
        </div>

        <div v-else class="flex justify-center py-6">
          <p>No results found.</p>
        </div>

        <div v-if="payload && payload.total > 0" class="search__pagination">
          <div class="text-sm">
            Page <input v-model.number="page" type="number" class="w-16 input input--xs"> of {{ pageCount }}
          </div>

          <div class="flex-1" />

          <div class="right">
            <Button
              class="button--xs" :disabled="page === 0" :loading="loading"
              @click.prevent="page -= 1">
              &#x3C;
            </Button>
            <Button
              class="button--xs" :disabled="page === pageCount" :loading="loading"
              @click.prevent="page += 1">
              &#x3E;
            </Button>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="justify-end buttons">
          <Button class="button--danger button--sm" @click="close">
            Close
          </Button>
        </div>
      </template>
    </Box>
  </dialog>
</template>

<script lang="ts">
import axios from 'axios'
import Swal from 'sweetalert2'
import { debounce, DebouncedFunc } from 'lodash'
import Dialog from '~/mixins/Dialog'

interface Data {
  value: string
  loading: boolean
  payload: any
  page: number
  search: DebouncedFunc<() => Promise<void>> | null
  type: 'any' | 'file' | 'directory' | 'text' | 'audio' | 'video' | 'image'
}

export default Dialog.extend({
  data: (): Data => ({
    value: '',
    loading: false,
    payload: null,
    page: 0,
    search: null,
    type: 'any'
  }),

  computed: {
    pageCount(): number {
      // ipfs-search.com only allows searching up to page 100
      return Math.min(this.payload.page_count - 1, 100)
    },

    searchQuery(): string {
      let query = this.value

      switch (this.type) {
        case 'text':
          query += ' metadata.Content-Type:("application/x-mobipocket-ebook" OR "application/epub+zip" OR "application/vnd.amazon.ebook" OR "image/vnd.djvu" OR "application/pdf" OR "text/html" OR "text/plain" OR "application/postscript" OR "application/rtf" OR "application/vnd.oasis.opendocument.text" OR "application/vnd.sun.xml.writer" OR "application/vnd.stardivision.writer" OR "application/x-starwriter" OR "application/msword" OR "application/vnd.openxmlformats-officedocument.wordprocessingml.document" OR "application/x-abiword")'
          break
        case 'audio':
          query += ' metadata.Content-Type:(audio*)'
          break
        case 'video':
          query += ' metadata.Content-Type:(video*)'
          break
        case 'image':
          query += ' metadata.Content-Type:(image*)'
          break
      }

      return query
    },

    searchType(): string {
      switch (this.type) {
        case 'text':
        case 'audio':
        case 'video':
        case 'image':
          return 'file'

        default:
          return this.type
      }
    }
  },

  watch: {
    page() {
      if (this.search) {
        this.search()
      }
    },

    type() {
      if (this.search) {
        this.search()
      }
    }
  },

  created() {
    this.search = debounce(this._search, 500)
  },

  methods: {
    openSearch(query: string) {
      this.value = query
      this.open()
      this._search()
    },

    normalizePage() {
      let normalized = this.page
      normalized = Math.max(normalized, 0)
      normalized = Math.min(normalized, 100)

      if (this.page !== normalized) {
        this.page = normalized
      }
    },

    async _search() {
      try {
        this.loading = true

        this.normalizePage()

        const response = await axios.get('https://api.ipfs-search.com/v1/search', {
          params: {
            q: this.searchQuery,
            type: this.searchType,
            page: this.page
          }
        })

        this.payload = response.data
      } catch (err) {
        Swal.fire({
          title: 'A problem has occurred',
          text: err.message,
          icon: 'error'
        })
      } finally {
        this.loading = false
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.search {
  @apply space-y-3;
}

.search__form {
  @apply flex;

  .button {
    @apply rounded-l-none;
  }

  select.input {
    width: 120px;
  }
}

.search__results {
  @apply overflow-y-auto overflow-x-hidden;
  max-height: 60vh;
}

.search__pagination {
  @apply flex items-center;
}

.item {
  @apply block px-3 py-5 cursor-pointer;

  &:hover {
    @apply bg-menus-light;
  }

  .title {
    @apply overflow-ellipsis overflow-hidden whitespace-nowrap;

    &::v-deep {
      em {
        @apply text-primary;
      }
    }
  }

  .hash {
    @apply text-xs text-snow-darker;
    @apply overflow-ellipsis overflow-hidden whitespace-nowrap;
  }

  .extra {
    @apply text-xs text-snow-dark;
  }
}
</style>
