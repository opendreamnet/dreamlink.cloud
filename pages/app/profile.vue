<template>
  <div v-if="$ipfs.started" class="profile">
    <!-- Header -->
    <ProfileHeader />

    <!-- Sections -->
    <div class="profile__content">
      <Box :class="`box--${section}`">
        <template #header>
          <ButtonsMenu v-model="section" :data="sections" />
        </template>

        <ProfileFiles v-show="section === 'pins'" />
        <ProfileNode v-show="section === 'node'" />
        <ProfileStorage v-show="section === 'storage'" />
        <ProfileSettings v-show="section === 'settings'" />
        <ProfileIdentity v-show="section === 'identity'" />
      </Box>
    </div>
  </div>

  <!-- Error -->
  <div v-else-if="$ipfs.error">
    <p>An error occurred while trying to start the IPFS node, please refresh the page or try another web browser:</p>
    <pre class="pre">
      <code>{{ $ipfs.error }}</code>
    </pre>
  </div>

  <!-- Loading -->
  <div v-else class="flex justify-center">
    <Loading class="scale-150" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data: () => ({
    section: 'pins'
  }),

  computed: {
    sections(): Record<string, string> {
      return {
        'Pinned Files': 'pins',
        Node: 'node',
        Storage: 'storage',
        Settings: 'settings',
        Identity: 'identity'
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.profile {
  @apply space-y-12;
}

.profile__content {
  &:deep(.button) {
    @apply border-0 #{!important};
  }

  /*
  &::v-deep {
    .button {
      @apply border-0 #{!important};
    }
  }
  */
}

.box--pins {
  &:deep(.box__body) {
    @apply px-0 #{!important};
  }

  /*
  &::v-deep {
    .box__body {
      @apply px-0 #{!important};
    }
  }
  */
}
</style>
