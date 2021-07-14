<template>
  <dialog class="dialog">
    <Box v-if="privateKey" title="New Identity">
      <div class="identity">
        <div class="identity__header">
          <h1 class="title">
            Congratulations, you are now:
          </h1>

          <figure class="avatar">
            <img :src="avatarURL">
          </figure>

          <h2 class="peerid">
            {{ privateKey.id }}
          </h2>
        </div>

        <Field title="Recovery Phrase" description="Keep the following words in a safe place, they will allow you to recover your new identity." hint="Once you close the dialog you will not be able to see it again.">
          <textarea v-clipboard="privateKey.mnemonic"
                    v-tooltip="'Click to copy.'"
                    :value="privateKey.mnemonic"
                    readonly
                    class="h-20 input" />
        </Field>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <Button class="button--danger button--sm" @click="reload">
            Close
          </Button>
        </div>
      </template>
    </Box>

    <Box v-else title="Creating new identity...">
      <div class="flex justify-center">
        <Loading class="scale-150" />
      </div>
    </Box>
  </dialog>
</template>

<script lang="ts">
import Swal from 'sweetalert2'
import { noop } from 'lodash'
import { PrivateKey } from '@opendreamnet/ipfs'
import Dialog from '~/mixins/Dialog'

interface Data {
  privateKey: PrivateKey | null
  avatarURL: string
}

export default Dialog.extend({
  data: (): Data => ({
    privateKey: null,
    avatarURL: ''
  }),

  methods: {
    ask() {
      Swal.fire({
        icon: 'warning',
        title: 'Are you sure you want to get a new identity?',
        text: 'You will lose administrator access to your databases, boards and you will have to share your new identity with people you trust.',
        confirmButtonText: 'Yes',
        confirmButtonColor: '#BF616A',
        showCancelButton: true
      }).then((value) => {
        if (value.isConfirmed) {
          this.run()
        }

        return value
      }).catch(noop)
    },

    async run() {
      this.open()

      // Scroll to top
      window.scrollTo(0, 0)

      try {
        this.privateKey = await this.$accessor.ipfs.resetIdentity()
        this.avatarURL = await this.$accessor.ipfs.getAvatarURL(this.privateKey.id)

        this.$accessor.settings.setIpfsPrivateKey(this.privateKey.toProtobuf())
        this.$accessor.settings.save()
      } catch (err) {
        this.close()

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message
        })
      }
    },

    reload() {
      location.reload()
    }
  }
})
</script>

<style lang="scss" scoped>
.identity {
  @apply space-y-9;
}

.identity__header {
  @apply flex flex-col items-center gap-y-9;
}

.title {
  @apply text-xl;
}

.avatar {
  img {
    @apply rounded-full border-2 border-snow-darker;
    height: 130px;
    width: 130px;
  }
}

.peerid {
  @apply  text-snow-darker;
  @apply overflow-ellipsis overflow-hidden whitespace-nowrap;
  max-width: 90vw;
}
</style>
