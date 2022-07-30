<template>
  <div class="profile">
    <div class="profile__left">
      <!-- Profile -->
      <Profile />

      <!-- Menu -->
      <Menu v-model="section" :items="sections" />
    </div>

    <div class="profile__right">
      <!-- Sections -->
      <ProfileFiles v-if="section === 'files'" />
      <ProfileNode v-if="section === 'node'" />
      <ProfileStorage v-if="section === 'storage'" />
      <ProfileSettings v-if="section === 'settings'" />
      <ProfileIdentity v-if="section === 'identity'" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data: () => ({
    section: 'storage'
  }),

  computed: {
    sections(): any {
      return [
        'Storage',
        'Settings',
        'Identity',
        'Node'
      ]
    }
  }
})
</script>

<style lang="scss" scoped>
.profile {
  @apply flex gap-12;
}

.profile__left {
  @apply space-y-12;
  width: 280px;
}

.profile__right {
  @apply flex-1;
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
