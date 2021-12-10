<template>
  <dialog class="dialog">
    <Box title="About chat rooms">
      <div class="prose">
        <p>
          {{ $config.name }} chat rooms are powered by IPFS <span title="Publish-subscribe (Pubsub) is an experimental feature in IPFS. Publishers send messages classified by topic or content, and subscribers receive only the messages they are interested in." class="border-b border-dotted text-primary cursor-help">Pubsub</span>, your messages travel securely and encrypted over a P2P connection.
        </p>

        <p>
          Because of this, using these chats has its advantages and disadvantages:
        </p>

        <ul>
          <li><strong>100% uptime.</strong> No central server, chat through a direct connection with participants at any time.</li>
          <li><strong>Censorship-proof.</strong> Chat rooms are public and no one has control over them, it is not possible to censor this type of communication.</li>
        </ul>

        <p class="font-bold text-danger">
          But...
        </p>

        <ul>
          <li><strong>No moderation tools.</strong> It is not possible to kick users or delete messages. It is recommended to invite only users you trust, using the same encryption key ensures that you only communicate with the people you want to.</li>
          <li><strong>No conversation history.</strong> We do not keep a record of the conversation anywhere, you will only see the messages sent after you joined.</li>
          <li><strong>Experimental.</strong> Pubsub is an experimental protocol and may have undiscovered security vulnerabilities.</li>
        </ul>

        <p>
          In future versions we plan to implement:
        </p>

        <ul>
          <li><strong>Ignore users.</strong></li>
          <li>Implementation with orbit-db to add moderation tools and conversation history.</li>
        </ul>
      </div>

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

})
</script>
