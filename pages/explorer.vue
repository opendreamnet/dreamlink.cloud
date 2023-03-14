<template>
  <div class="explorer">
    <!-- Preview -->
    <NetworkObjectPreview :entry="entry" :cid="cid" class="explorer__preview" />

    <!-- Title -->
    <div class="explorer__info">
      <div
        v-tippy="'CID: This is how your file is identified on the network. Click to copy.'"
        v-clipboard="cid"
        class="cid">
        {{ cid }}
      </div>

      <div v-if="name" class="filename">
        {{ name }}
      </div>
    </div>

    <!-- Buttons -->
    <NetworkObjectButtons :entry="entry" :cid="cid" class="explorer__buttons" />

    <div class="explorer__cols">
      <div class="explorer__left">
        <!-- Share -->
        <NetworkObjectShare :cid="cid" :name="name" />
      </div>

      <div class="explorer__right">
        <!-- Details -->
        <NetworkObjectDetails :entry="entry" :cid="cid" />

        <!-- Node Actions -->
        <NetworkObjectActions :entry="entry" :cid="cid" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { isString } from 'lodash'
import { MetaInfo } from 'vue-meta/types'
import { cid } from 'is-ipfs'

interface IData {
  entry: Entry | null
}

export default Vue.extend({
  middleware: ({ route, redirect }) => {
    const { query } = route

    if (!isString(query.cid) || !cid(query.cid)) {
      return redirect('/')
    }
  },

  data: (): IData => ({
    entry: null
  }),

  head(): MetaInfo {
    const title = this.name || this.cid

    return {
      titleTemplate: `%s - ${title}`,
      meta: [
        {
          name: 'description',
          content: `Download ${title} from IPFS.`
        }
      ]
    }
  },

  computed: {
    cid(): string {
      return this.$route.query.cid as string
    },

    name(): string | null {
      return this.$route.query.name as string | null || this.$route.query.filename as string | null
    }
  },

  created() {
    this.createEntry()
  },

  methods: {
    async createEntry() {
      if (this.entry) {
        return
      }

      try {
        this.entry = await this.$ipfs.fromCID(this.cid, {
          name: this.name ?? undefined,
          timeout: 15 * 60 * 1000, // 15 minutes
          cache: 'explorer',
          stats: true,
          subentries: true,
          peers: true
        })

        // Debug
        if (process.env.NODE_ENV !== 'production') {
          // @ts-ignore
          window.ipfsRecord = this.entry
        }
      } catch (err: any) {
        console.warn('[NetworkObject] Failed to fetch the entry:', err.message)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.explorer {

}

.explorer__preview {
  @apply mb-10 -mt-10;

  @screen md {
    @apply -mt-14;
  }
}

.explorer__info {
  @apply mb-10 space-y-1 text-center;

  .cid {
    @apply text-origin-lighten font-bold text-xl cursor-pointer;
    @apply overflow-ellipsis overflow-hidden whitespace-nowrap break-words;

    @screen md {
      @apply text-2xl;
    }
  }

  .filename {
    @apply text-origin-dark;
    @apply overflow-ellipsis overflow-hidden whitespace-nowrap break-words;
  }
}

.explorer__buttons {
  @apply mb-10;
}

.explorer__cols {
  @apply flex flex-col gap-12;

  @screen md {
    @apply flex-row space-y-0;
  }
}

.explorer__left {
  @apply flex-1;
}

.explorer__right {
  @apply space-y-12;

  @screen md {
    width: 300px;
  }
}

.explorer__remember {
  @apply text-sm;

  a {
    @apply text-primary underline;
  }
}
</style>
