<template>
  <div class="explorer">
    <NetworkObjectPreview :cid="cid" :filename="filename" class="explorer__preview" />

    <div class="explorer__info">
      <h1 class="title">
        {{ filename || cid }}
      </h1>

      <h2 v-if="filename" v-tooltip="'This is how your file is identified on the network and is necessary to return to it.'" class="text-blue">
        {{ cid }}
      </h2>
    </div>

    <NetworkObjectButtons :cid="cid" :filename="filename" class="explorer__buttons" />

    <div class="explorer__cols">
      <div class="explorer__left">
        <NetworkObjectShare :cid="cid" :filename="filename" />
      </div>

      <div class="explorer__right">
        <NetworkObjectDetails :cid="cid" :filename="filename" />

        <Box class="explorer__remember">
          <p>Remember that files uploaded with {{ $config.name }} are only persistent as long as <a href="#" @click.prevent="openNodeDialog()">your IPFS node is up</a> otherwise they can be lost in a matter of hours or days.</p>

          <p>If you are the uploader of this file remember to keep any {{ $config.name }} tab open and active or <a href="https://docs.ipfs.io/concepts/persistence/#pinning-in-context" target="_blank">pin the file</a> to a persistent IPFS node to keep the file alive.</p>
        </Box>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MetaInfo } from 'vue-meta/types'
import isIPFS from 'is-ipfs'

export default Vue.extend({
  middleware: ({ route, redirect, $ipfs }) => {
    const { query } = route

    if (!query.cid || !isIPFS.cid(query.cid)) {
      return redirect('/')
    }

    $ipfs.add(query.cid as string)
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
    },
    type(): string {
      return this.$route.query.type as string
    },
    downloadURL(): string {
      return `https://odn.pw/ipfs/${this.cid}?filename=${this.filename}&download=true`
    },
    previewURL(): string {
      return `https://odn.pw/ipfs/${this.cid}?filename=${this.filename}&download=false`
    }
  },

  methods: {
    openNodeDialog() {
      this.$bus.emit('node.dialog')
    }
  }
})
</script>

<style lang="scss" scoped>
.explorer {

}

.explorer__preview {
  @apply mb-6 -mt-12 shadow-xl;
}

.explorer__info {
  @apply mb-6 text-center;

  h1 {
    @apply text-2xl break-words;
  }

  h2 {
    @apply text-snow-darker break-words;
  }
}

.explorer__buttons {
  @apply mb-14;
}

.explorer__cols {
  @apply space-y-6;

  @screen md {
    @apply flex gap-9 space-y-0;
  }
}

.explorer__left {
  @apply flex-1 space-y-6;
}

.explorer__right {
  @apply space-y-6;

  @screen md {
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
