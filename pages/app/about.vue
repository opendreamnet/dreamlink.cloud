<template>
  <div class="about">
    <Section :title="`🤔 What is ${$config.name}?`">
      <div class="prose prose-lg">
        <p>
          {{ $config.name }} is a static website with tools running on the decentralized P2P network: <a href="https://docs.ipfs.io/concepts/what-is-ipfs/" target="_blank">IPFS</a>.
        </p>

        <p>
          All tools (except for search) run without central servers, on a network of thousands of nodes around the world, making it <a href="https://docs.ipfs.io/concepts/what-is-ipfs/#decentralization" target="_blank">fail-safe and censorship-proof</a>.
        </p>

        <p>
          The moment you enter you are already connected to the IPFS network as we provide you with a node that runs in your web browser.
        </p>
      </div>
    </Section>

    <Section title="✨ Tools available">
      <div class="prose prose-lg">
        <p>All the magic happens between you and your web browser, there are no servers in between that can censor your activity.</p>

        <ul>
          <li>
            <strong>Share.</strong> Upload files and folders, <span class="text-primary">without account, size or bandwith limits</span>. You are your own file provider.
          </li>
          <li>
            <strong>Search.</strong> Search files and folders thanks to <a href="https://ipfs-search.com" target="_blank">ipfs-search.com</a>
          </li>
          <li>
            <strong>Pastebin.</strong> Create and share any text format.
          </li>
          <li>
            <strong>Chat.</strong> Create an encrypted P2P chat room for free communication between people you trust.
          </li>
        </ul>
      </div>
    </Section>

    <Section :title="`😨 What if ${$config.name} goes down?`">
      <div class="prose prose-lg">
        <p>{{ $config.name }} itself is a webpage stored in IPFS!</p>

        <p>
          You can use an HTTP Gateway, a web browser with IPFS support or download it to your node:
        </p>

        <Gateways />
      </div>
    </Section>

    <Section id="faq" title="❓ FAQ">
      <div class="space-y-3 prose prose-lg">
        <details>
          <summary class="title">
            Is it safe to upload files in {{ $config.name }}?
          </summary>

          <p>Depends on what you consider safe.</p>

          <p>OpenDreamNet does not store your files on private servers, they stay within your web browser's storage and on IPFS nodes around the world.</p>

          <p>IPFS is a P2P protocol so please note the following:</p>

          <ul>
            <li>All data you upload to IPFS is public.</li>
            <li>If you need to upload a file with sensitive information first encrypt it with external tools.</li>
            <li>It is possible to trace a file back to the IP addresses of the nodes that distribute it, even if you use applications such as VPN or Tor.</li>
            <li>You can read more about <a href="https://docs.ipfs.io/concepts/privacy/" target="_blank">privacy and IPFS here</a>.</li>
          </ul>
        </details>

        <details>
          <summary class="title">
            Where can I see the files I have uploaded?
          </summary>

          <p>
            In your <NuxtLink to="/app/profile">
              profile
            </NuxtLink> you can find the list of pinned files.
          </p>
        </details>
      </div>
    </Section>
  </div>
</template>

<style lang="scss" scoped>
.about {
  @apply mx-auto space-y-6 max-w-prose;

  details {
    summary {
      @apply cursor-pointer;
    }
  }
}

.tip {
  @apply text-primary cursor-help border-b border-dotted;
}
</style>
