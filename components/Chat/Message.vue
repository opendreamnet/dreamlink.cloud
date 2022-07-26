<template>
  <div v-if="canShow" class="message">
    <div class="message__avatar">
      <figure>
        <img :src="`https://avatars.dicebear.com/api/micah/${record.from}.svg?mouth[]=laughing&mouth[]=nervous&mouth[]=smile&glassesProbability=80&width=60&height=60`">
      </figure>
    </div>

    <div class="message__body">
      <div class="message__title">
        <span v-if="username" class="message__username">
          {{ username }}
        </span>

        <span class="message__cid">
          {{ record.from | cid }}
        </span>

        <span class="message__date">{{ record.date | dateFormat }}</span>
      </div>

      <div v-if="content" class="message__content" v-html="$md.render(content)" />

      <div v-else class="font-bold message__content text-danger">
        <p>🔐 This message has been encrypted with another key.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { decryptMessage } from '~/modules/utils'
import { ChatRecord, Message } from '~/types'

interface Data {
  message: Message | null
}

export default Vue.extend({
  filters: {
    cid(value: string) {
      return `${value.substring(0, 5)}...${value.substring(value.length - 5, value.length)}`
    }
  },

  props: {
    record: {
      type: Object as () => ChatRecord,
      required: true
    },
    secretKey: {
      type: String,
      required: true
    }
  },

  data: (): Data => ({
    message: null
  }),

  computed: {
    username(): string | null {
      return this.message?.username || null
    },

    content(): string | null {
      return this.message?.content || null
    },

    canShow(): boolean {
      if (!this.content && this.$accessor.settings.ignoreInvalid) {
        return false
      }

      return true
    }
  },

  watch: {
    secretKey: {
      immediate: true,
      handler(value: string) {
        this.message = decryptMessage(this.record.data, value)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.message {
  @apply flex gap-x-3;
}

.message__avatar {
  @apply flex-shrink-0;
  flex-basis: 52px;

  figure {
    @apply -mt-2 -ml-2;
  }
}

.message__body {
  @apply flex-grow;
  min-width: 0;

  .message__title {
    @apply flex items-center gap-x-2;
    @apply text-sm;
  }

  .message__username {
    @apply inline-block font-semibold;
    @apply overflow-hidden overflow-ellipsis whitespace-nowrap;
  }

  .message__cid {
    @apply inline-block text-xs text-snow-darken;
    @apply overflow-hidden overflow-ellipsis whitespace-nowrap;
  }

  .message__date {
    @apply inline-block text-snow-dark min-w-max;
  }

  .message__content {
    @apply text-snow-lighten;
  }
}
</style>
