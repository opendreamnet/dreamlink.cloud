<template>
  <div v-if="canShow" class="preview" :class="cssPreview">
    <video v-if="isVideo" id="video" ref="video" controls>
      <source :src="previewURL" :type="mime">
      Your browser does not support the video tag.
    </video>

    <audio v-else-if="isAudio" ref="audio" controls>
      <source :src="previewURL" :type="mime">
      Your browser does not support the audio tag.
    </audio>

    <img v-else-if="isImage" :src="previewURL">

    <iframe
      v-else
      :src="previewURL"
      frameborder="0"
      marginheight="0px"
      marginwidth="0px"
    />
  </div>
</template>

<script lang="ts">
import mime from 'mime'
// @ts-ignore
import Moovie from 'mooviejs'
import { startsWith } from 'lodash'

import NetworkObject from '~/mixins/NetworkObject'

interface Data {
  installed: boolean
}

export default NetworkObject.extend({
  data: (): Data => ({
    installed: false
  }),

  watch: {
    canShow(value: boolean) {
      if (!value) {
        return
      }

      this.$nextTick(() => {
        this.install()
      })
    }
  },

  computed: {
    mime(): string | null {
      if (!this.record) {
        return null
      }

      if (this.record.isDirectory) {
        return null
      }

      return mime.getType(this.filename)
    },

    canShow(): boolean {
      if (!this.mime) {
        return false
      }

      if (!this.previewURL) {
        return false
      }

      return this.isVideo || this.isAudio || this.isImage || this.isSecure
    },

    isVideo(): boolean {
      if (!this.mime) {
        return false
      }

      return startsWith(this.mime, 'video/')
    },

    isAudio(): boolean {
      if (!this.mime) {
        return false
      }

      return startsWith(this.mime, 'audio/')
    },

    isImage(): boolean {
      if (!this.mime) {
        return false
      }

      return startsWith(this.mime, 'image/')
    },

    isSecure(): boolean {
      return this.mime === 'application/pdf'
    },

    cssPreview(): any {
      return {
        'preview--video': this.isVideo,
        'preview--audio': this.isAudio,
        'preview--image': this.isImage
      }
    },

    previewURL(): string | null {
      if (!this.gatewayURI) {
        return null
      }

      return this.gatewayURI.clone().query({ filename: this.filename }).href()
    }
  },

  methods: {
    install() {
      if (this.installed) {
        return
      }

      if (!this.canShow || !this.previewURL) {
        return
      }

      this.installed = true

      if (this.isVideo) {
        this.createVideoPlayer()
      }
    },

    createVideoPlayer() {
      const player = new Moovie({
        selector: '#video',
        dimensions: {
          width: '100%',
          height: '100%'
        },
        icons: {
          path: 'https://raw.githubusercontent.com/BMSVieira/moovie.js/main/icons/'
        }
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.preview {
  @apply bg-black;
  min-height: 100px;
  height: 75vh;

  iframe {
    @apply w-full h-full;
  }
}

.preview--audio {
  @apply flex justify-center p-9;
  height: auto;
}

.preview--image {
  @apply flex justify-center;

  img {
    @apply object-contain;
  }
}
</style>

<style lang="scss">
.moovie {
  @apply font-sans h-full;
}

audio {
  @apply w-full;
  font-feature-settings: initial;
}
</style>
