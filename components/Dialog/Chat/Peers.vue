<template>
  <dialog class="dialog">
    <Box title="Peers in the room.">
      <ul class="peers">
        <li :key="$ipfs.identity.id">
          <figure>
            <img :src="`https://avatars.dicebear.com/api/micah/${$ipfs.identity.id}.svg?mouth[]=laughing&mouth[]=nervous&mouth[]=smile&glassesProbability=80&width=80&height=80`">
          </figure>

          <span>{{ $ipfs.identity.id }}</span>
        </li>

        <li v-for="peer of peers" :key="peer">
          <figure>
            <img :src="`https://avatars.dicebear.com/api/micah/${peer}.svg?mouth[]=laughing&mouth[]=nervous&mouth[]=smile&glassesProbability=80&width=80&height=80`">
          </figure>

          <span>{{ peer }}</span>
        </li>
      </ul>

      <p class="text-xs text-center">
        (Finding connected peers may take a few minutes)
      </p>

      <template #footer>
        <div class="flex justify-end gap-3">
          <Button class="button--danger button--sm" @click="close">
            Close
          </Button>
        </div>
      </template>
    </Box>
  </dialog>
</template>

<script lang="ts">
import Dialog from '~/mixins/Dialog'

export default Dialog.extend({
  props: {
    peers: {
      type: Array as () => string[],
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
.peers {
  @apply overflow-auto mb-6;
  max-height: 400px;

  li {
    @apply flex items-center gap-3 py-5;

    figure {
      @apply -mt-2 -ml-2 flex-grow-0;
      flex-basis: 72px;
    }

    span {
      @apply text-sm text-snow-light;
      @apply overflow-hidden overflow-ellipsis whitespace-nowrap;
    }
  }
}
</style>
