<template>
  <div v-if="canShow" class="preview">
    <div class="preview__overlay" :class="cssPreview">
      <!-- Markdown -->
      <div v-if="isMarkdown" class="prose preview__markdown" v-html="$md.render(content)" />

      <!-- Text / Code -->
      <pre v-else-if="isText" class="preview__text"><code class="hljs" v-html="codeHighlight" /></pre>

      <!-- Video -->
      <video
        v-else-if="isVideo"
        id="video"
        ref="video"
        controls>
        <source :src="previewURL" :type="mime">
        Your browser does not support the video tag.
      </video>

      <!-- Audio -->
      <audio v-else-if="isAudio" ref="audio" controls>
        <source :src="previewURL" :type="mime">
        Your browser does not support the audio tag.
      </audio>

      <!-- Image -->
      <img v-else-if="isImage" :src="previewURL">

      <!-- Safe formats (PDF) -->
      <iframe
        v-else
        :src="previewURL"
        frameborder="0"
        marginheight="0px"
        marginwidth="0px" />
    </div>
  </div>

  <div v-else-if="canShowSharingWarning" class="preview">
    <div class="preview__overlay preview--loading">
      <figure class="icon">
        <FontAwesomeIcon icon="spinner" class="animate-spin" />
      </figure>

      <h1 class="title">
        Your file is being distributed to other IPFS nodes around the world...
      </h1>

      <h2 class="subtitle">
        Please be patient, in a few minutes you will be able to share it with the world.
      </h2>
    </div>
  </div>

  <div v-else-if="canShowLoading" class="preview">
    <div class="preview__overlay preview--loading">
      <figure class="icon">
        <FontAwesomeIcon icon="spinner" class="animate-spin" />
      </figure>

      <h1 class="title">
        We are trying to load the file...
      </h1>

      <h2 class="subtitle">
        Please wait a few minutes, if the file does not load it is possible that is <span class="underline cursor-pointer text-danger" @click.prevent="$refs.dialogPersistence.open()">no longer being distributed</span>.
      </h2>
    </div>

    <DialogPersistence ref="dialogPersistence" />
  </div>
</template>

<script lang="ts">
import mime from 'mime'
// @ts-ignore
import Moovie from 'mooviejs'
import { startsWith, isNil } from 'lodash'
import hljs from 'highlight.js'
import NetworkObject from '~/mixins/NetworkObject'

interface Data {
  installed: boolean
  content: string
  codeHighlight: string | null
}

export default NetworkObject.extend({
  data: (): Data => ({
    installed: false,
    content: '',
    codeHighlight: null
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
    /**
     * Mimetype of the file.
     */
    mime(): string | null {
      if (this.record && this.record.isDirectory) {
        // We now know that it is a directory.
        return null
      }

      if (!this.filename) {
        // Without a file name we cannot know what it is.
        return null
      }

      return mime.getType(this.filename)
    },

    /**
     * True if we can show a preview of the file.
     */
    canShow(): boolean {
      if (!this.mime) {
        return false
      }

      if (!this.isText && !this.previewURL) {
        // We need a public gateway to display the content.
        return false
      }

      if (this.isText && (!this.record || !this.record.size || this.record.size > 2097152)) {
        // To display a text we must download it and for security/performance reasons we will not download a large file.
        return false
      }

      return this.isFrame || this.isText || this.isVideo || this.isAudio || this.isImage
    },

    /**
     * True if we can display the message of the file being distributed on the network.
     */
    canShowSharingWarning(): boolean {
      return this.$route.query.uploader === 'true' && !this.previewURL
    },

    /**
     * True if we can display the loading message.
     */
    canShowLoading(): boolean {
      return !this.previewURL
    },

    /**
     * True if the file is a video.
     */
    isVideo(): boolean {
      if (!this.mime) {
        return false
      }

      return startsWith(this.mime, 'video/')
    },

    /**
     * True if the file is an audio.
     */
    isAudio(): boolean {
      if (!this.mime) {
        return false
      }

      return startsWith(this.mime, 'audio/')
    },

    /**
     * True if the file is an image.
     */
    isImage(): boolean {
      if (!this.mime) {
        return false
      }

      return startsWith(this.mime, 'image/')
    },

    /**
     * True if the file is text (or code).
     */
    isText(): boolean {
      if (!this.mime) {
        return false
      }

      return !isNil(this.language) || startsWith(this.mime, 'text/')
    },

    /**
     * True if the file is markdown.
     */
    isMarkdown(): boolean {
      return this.language === 'Markdown'
    },

    /**
     * True when the file is a safe format that we can display in an iframe.
     */
    isFrame(): boolean {
      return this.mime === 'application/pdf'
    },

    /**
     * Language detected by file name.
     */
    language(): string | null {
      if (!this.filename) {
        return null
      }

      const ext = this.filename.split('.').pop() || ''
      const lang = hljs.getLanguage(ext)

      return lang?.name || null
    },

    /**
     * CSS classes added to the container.
     */
    cssPreview(): any {
      return {
        'preview--audio': this.isAudio,
        'preview--image': this.isImage
      }
    },

    /**
     * Public gateway URL to the content.
     */
    previewURL(): string | null {
      if (!this.gatewayURI) {
        return null
      }

      return this.gatewayURI.clone().query({ filename: this.filename }).href()
    }
  },

  methods: {
    /**
     * Install what is necessary to display the preview.
     */
    async install() {
      if (this.installed) {
        return
      }

      if (!this.canShow) {
        console.trace('This should not happen! [!this.canShow || !this.previewURL]')
        return
      }

      if (this.isText || this.isMarkdown) {
        if (!this.record) {
          console.trace('This should not happen! [!this.record]')
          return
        }

        await this.record.waitUntilReady()

        if (!this.record.file) {
          console.trace('This should not happen! [!this.record.file]')
          return
        }

        this.content = await this.record.file.getContentString()

        if (!this.isMarkdown) {
          try {
            // Markdown is rendered with another module.
            this.codeHighlight = hljs.highlight(this.content, { language: this.language || '', ignoreIllegals: true }).value
          } catch (err) {
            this.codeHighlight = this.content
          }
        }
      } else if (this.isVideo) {
        this.createVideoPlayer()
      }

      this.installed = true
    },

    createVideoPlayer() {
      // eslint-disable-next-line no-new
      new Moovie({
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
  min-height: 100px;
  height: 75vh;

  iframe {
    @apply w-full h-full;
  }
}

.preview__overlay {
  @apply absolute left-0 right-0;
  @apply bg-black overflow-y-auto shadow-xl;
  min-height: 100px;
  height: 75vh;
}

.preview--loading {
  @apply flex flex-col justify-center items-center space-y-2 px-3;

  .icon {
    @apply mb-9 text-6xl;
  }

  .title {
    @apply text-2xl text-white;
  }

  .subtitle {
    @apply text-snow-dark;
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

.preview__text {
  @apply block overflow-y-auto overflow-x-hidden;
  @apply font-mono h-full w-full;

  code {
    @apply h-full;
  }
}

.preview__markdown {
  @apply p-6 max-w-none;
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
