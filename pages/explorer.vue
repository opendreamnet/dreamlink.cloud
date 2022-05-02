<template>
  <div class="explorer">
    <!-- Preview -->
    <NetworkObjectPreview :cid="cid" :filename="filename" class="explorer__preview" />

    <!-- Title -->
    <div class="explorer__info">
      <div
        v-tooltip="'CID: This is how your file is identified on the network. Click to copy.'"
        v-clipboard="cid"
        class="cid">
        {{ cid }}
      </div>

      <div v-if="filename" class="filename">
        {{ filename }}
      </div>
    </div>

    <NetworkObjectButtons
      :cid="cid"
      :filename="filename"
      class="explorer__buttons" />

    <div class="explorer__cols">
      <div class="explorer__left">
        <NetworkObjectShare :cid="cid" :filename="filename" />
      </div>

      <div class="explorer__right">
        <LazyNetworkObjectDetails :cid="cid" :filename="filename" />
        <LazyNetworkObjectActions :cid="cid" :filename="filename" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MetaInfo } from 'vue-meta/types'
import isIPFS from 'is-ipfs'

export default Vue.extend({
  middleware: ({ route, redirect }) => {
    const { query } = route

    if (!query.cid || !isIPFS.cid(query.cid)) {
      return redirect('/')
    }
  },

  head(): MetaInfo {
    const title = this.$route.query.filename as string || this.$route.query.cid as string

    return {
      titleTemplate: `%s - ${title}`,
      meta: [
        {
          name: 'description',
          content: `Download ${title} file from IPFS.`
        }
      ]
    }
  },

  computed: {
    cid(): string {
      return this.$route.query.cid as string
    },
    filename(): string {
      return this.$route.query.filename as string
    }
  }
})
</script>

<style lang="scss" scoped>
.explorer {

}

.explorer__preview {
  @apply mb-6 -mt-10;

  @screen md {
    @apply -mt-20;
  }
}

.explorer__info {
  @apply mb-9 space-y-1 text-center;

  .cid {
    @apply text-white font-bold text-xl cursor-pointer;
    @apply overflow-ellipsis overflow-hidden whitespace-nowrap break-words;

    @screen md {
      @apply text-2xl;
    }
  }

  .filename {
    @apply overflow-ellipsis overflow-hidden whitespace-nowrap break-words;
  }
}

.explorer__buttons {
  @apply mb-14;
}

.explorer__cols {
  @apply space-y-6;

  @screen lg {
    @apply flex gap-9 space-y-0;
  }
}

.explorer__left {
  @apply flex-1 space-y-6;
}

.explorer__right {
  @apply space-y-6;

  @screen lg {
    width: 350px;
  }
}

.explorer__remember {
  @apply text-sm;

  a {
    @apply text-primary underline;
  }
}
</style>
