<template>
  <nav v-if="$accessor.ipfs.appCID">
    <div class="font-bold text-origin-lighten item">
      Mirrors
    </div>

    <a v-if="$config.app.url" :href="$config.app.url" target="_blank" class="item">
      {{ $config.app.url }}
    </a>

    <a :href="`https://dweb.link/ipfs/${$accessor.ipfs.appCID}`" target="_blank" class="item" rel="noopener noreferrer">
      dweb.link
    </a>

    <a :href="`https://ipfs.infura.io/ipfs/${$accessor.ipfs.appCID}`" target="_blank" class="item" rel="noopener noreferrer">
      ipfs.infura.io
    </a>

    <a :href="`ipfs://${$accessor.ipfs.appCID}`" target="_blank" class="item" rel="noopener noreferrer">
      ipfs://
    </a>
  </nav>
</template>
