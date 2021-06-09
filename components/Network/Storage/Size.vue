<template>
  <span>{{ $storage.usage | prettyBytes }} of {{ $storage.quota | prettyBytes }} used.</span>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({

})
</script>
