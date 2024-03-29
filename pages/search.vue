<template>
  <div class="search max-w-prose">
    <Section title="Search" subtitle="Powered by ipfs-search.com">
      <!-- Form -->
      <form class="search__form" @submit.prevent="search">
        <input
          v-model="value"
          placeholder="What are you looking for?"
          class="mb-6 input"
          required>

        <div class="search__input">
          <select v-model="type" class="w-1/3 input">
            <option value="any">
              Any type
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
            <option value="zip">
              Zip
            </option>
          </select>

          <select v-model="sizes" class="w-1/3 input">
            <option :value="[]">
              Any size
            </option>

            <option :value="['<=1048576']">
              0 - 1 MB
            </option>

            <option :value="['>1048576', '<=10485760']">
              1 - 10 MB
            </option>

            <option :value="['>10485760', '<=52428800']">
              10 - 50 MB
            </option>

            <option :value="['>52428800', '<=104857600']">
              50 - 100 MB
            </option>

            <option :value="['>104857600', '<=1073741824']">
              100 MB - 1 GB
            </option>

            <option :value="['>1073741824']">
              1 GB+
            </option>
          </select>

          <select v-model="lastSeen" class="w-1/3 input">
            <option value="any">
              At any time
            </option>

            <option value="now-1h/h TO *">
              &lt; 1h
            </option>

            <option value="now-12h/h TO *">
              &lt; 12h
            </option>

            <option value="now-24h/h TO *">
              &lt; 24h
            </option>

            <option value="now/h-7d TO *">
              &lt; 7d
            </option>

            <option value="now/d-30d TO *">
              &lt; 30d
            </option>
          </select>
        </div>

        <div class="flex justify-center">
          <Button :loading="loading">
            Search
          </Button>
        </div>
      </form>
    </Section>

    <Section v-if="searched" title="Results">
      <div v-if="payload && payload.total > 0" class="search__results">
        <NuxtLink
          v-for="item in payload.hits"
          :key="item.hash"
          :to="{ path: '/explorer', query: { cid: item.hash, name: (item.title || '').replace( /(<([^>]+)>)/ig, '') } }"
          target="_blank"
          class="item">
          <div class="item__icon">
            <FontAwesomeIcon :icon="getIcon(item.mimetype)" />
          </div>

          <div class="item__data">
            <div class="extra">
              {{ item.size | prettyBytes }} - {{ item['last-seen'] | toRelative }} - {{ item.mimetype }}
            </div>

            <div class="title" v-html="item.title" />

            <div class="hash">
              {{ item.hash }}
            </div>
          </div>
        </NuxtLink>
      </div>

      <div v-else class="flex justify-center py-6">
        <p>🔍 No results found.</p>
      </div>

      <div v-if="payload && payload.total > 0" class="search__pagination">
        <div class="text-sm">
          Page <input v-model.number="page" type="number" class="w-16 input input--xs"> of {{ pageCount }}
        </div>

        <div class="flex-1" />

        <div class="right">
          <Button
            class="button--xs"
            :disabled="page === 0"
            :loading="loading"
            @click.prevent="page -= 1">
            &#x3C;
          </Button>
          <Button
            class="button--xs"
            :disabled="page === pageCount"
            :loading="loading"
            @click.prevent="page += 1">
            &#x3E;
          </Button>
        </div>
      </div>
    </Section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { debounce, DebouncedFunc, upperFirst } from 'lodash'
import { getIconFromMime } from '~/modules/utils'

interface IData {
  value: string
  type: 'any' | 'file' | 'directory' | 'text' | 'audio' | 'video' | 'image' | 'zip'
  sizes: string[]
  lastSeen: string

  loading: boolean
  payload: any
  page: number
  search: DebouncedFunc<() => Promise<void>> | null
  searched: boolean
}

export default Vue.extend({
  filters: {
    upperFirst(value: string) {
      return upperFirst(value)
    }
  },

  data: (): IData => ({
    value: '',
    sizes: [],
    lastSeen: 'now-24h/h TO *',

    loading: false,
    payload: null,
    page: 0,
    search: null,
    type: 'any',
    searched: false
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
        case 'zip':
          query += ' metadata.Content-Type:("application/gzip" OR "application/zip")'
          break
      }

      for (const size of this.sizes) {
        query += ` size:${size}`
      }

      if (this.lastSeen !== 'any') {
        query += ` last-seen:[${this.lastSeen}]`
      }

      return query
    },

    searchType(): string {
      switch (this.type) {
        case 'text':
        case 'audio':
        case 'video':
        case 'image':
        case 'zip':
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
    },

    sizes() {
      if (this.search) {
        this.search()
      }
    },

    lastSeen() {
      if (this.search) {
        this.search()
      }
    }
  },

  created() {
    this.search = debounce(this._search, 500)
  },

  methods: {
    normalizePage() {
      let normalized = this.page
      normalized = Math.max(normalized, 0)
      normalized = Math.min(normalized, 100)

      if (this.page !== normalized) {
        this.page = normalized
      }
    },

    async _search() {
      if (this.value.length === 0) {
        return
      }

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
        this.searched = true
      } catch (err: any) {
        Swal.fire({
          title: 'A problem has occurred',
          text: err.message,
          icon: 'error'
        })
      } finally {
        this.loading = false
      }
    },

    /**
     * Returns the icon according to the file type.
     */
    getIcon(mimetype?: string): string {
      return getIconFromMime(mimetype)
    }
  }
})
</script>

<style lang="scss" scoped>
.search__input {
  @apply flex mb-6 gap-6;
}

.search__results {
  @apply mb-6;
}

.search__pagination {
  @apply flex items-center;
}

.item {
  @apply flex gap-4;
  @apply p-4 cursor-pointer;

  &:hover {
    @apply bg-menus-light;
  }

  .title {
    @apply font-bold overflow-ellipsis overflow-hidden whitespace-nowrap;

    &:deep(em) {
      @apply text-primary-lighten;
    }
  }

  .hash {
    @apply text-xs text-origin-darken;
    @apply overflow-ellipsis overflow-hidden whitespace-nowrap;
  }

  .extra {
    @apply font-semibold text-xs text-origin-dark;
  }
}

.item__icon {
  @apply flex justify-center items-center text-2xl;
}

.item__data {
  @apply flex-1 overflow-hidden;
}
</style>
