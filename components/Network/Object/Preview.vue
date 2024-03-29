<template>
  <!-- Preview -->
  <div v-if="canShow" class="preview">
    <div class="preview__overlay" :class="cssPreview">
      <!-- Markdown -->
      <div v-if="isMarkdown" class="prose preview__markdown" v-html="$md.render(content)" />

      <!-- Text / Code -->
      <pre v-else-if="isText" class="preview__text">
        <code class="hljs" v-html="codeHighlight" />
      </pre>

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

  <!-- Sharing message -->
  <div v-else-if="canShowSharingWarning" class="preview">
    <div class="preview__overlay preview--loading">
      <figure class="icon">
        <FontAwesomeIcon icon="spinner" class="animate-spin" />
      </figure>

      <div class="title">
        Sharing your file...
      </div>

      <div class="subtitle">
        <p>This may take a few minutes.</p>
      </div>
    </div>
  </div>

  <!-- Loading message -->
  <div v-else-if="canShowLoading" class="preview">
    <div class="preview__overlay preview--loading">
      <figure class="icon">
        <FontAwesomeIcon icon="spinner" class="animate-spin" />
      </figure>

      <div class="title">
        Loading file...
      </div>

      <div class="subtitle">
        <p>This may take a few minutes.</p>
        <p><span class="cursor-pointer text-danger hover:underline" @click.prevent="$refs.dialogPersistence.open()">Taking a while?</span></p>
      </div>
    </div>

    <!-- Dialogs -->
    <DialogPersistence ref="dialogPersistence" />
  </div>
</template>

<script lang="ts">
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

  computed: {
    /**
     * Mimetype of the file.
     */
    mime(): string | null {
      return this.entry?.mimetype || null
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

      if (this.isText && (!this.entry || !this.entry.size || this.entry.size > 2097152)) {
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
        if (!this.entry) {
          console.trace('This should not happen! [!this.entry]')
          return
        }

        if (this.entry.type === 'dir') {
          console.trace('This should not happen! [!this.entry.type]')
          return
        }

        this.content = await this.entry.getContentString()

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
    @apply text-2xl text-white text-center font-bold;
  }

  .subtitle {
    @apply text-snow-dark text-center;
  }
}

.preview--audio {
  @apply flex justify-center items-center p-9;
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
