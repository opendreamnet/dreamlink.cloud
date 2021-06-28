<template>
  <div class="about">
    <Box id="dreamlink" :title="`🤔 What is ${$config.name}?`">
      <div class="prose">
        <p>
          {{ $config.name }} is a website that offers a set of tools that run entirely on the decentralized P2P network: <a href="https://docs.ipfs.io/concepts/what-is-ipfs/" target="_blank">IPFS</a>.
        </p>

        <p>
          All tools (except for search) run without central servers, on a network of thousands of nodes around the world, making it <a href="https://docs.ipfs.io/concepts/what-is-ipfs/#decentralization" target="_blank">fail-safe and censorship-proof</a>.
        </p>

        <p>
          The moment you enter you are already connected to the IPFS network, as we provide you with a node that runs in your web browser, without installing anything!
        </p>
      </div>
    </Box>

    <Box id="tools" :title="`✨ Tools available in ${$config.name}.`">
      <div class="prose">
        <p>All the magic happens between you and your web browser, there are no servers in between that can process, track or censor your activity.</p>

        <ul>
          <li>
            <strong>Share.</strong> Upload files or even folders, <span class="text-primary">without registration, size or bandwith limits</span>. You are your own file distributor.
          </li>
          <li>
            <strong>Search.</strong> Search for files or folders thanks to <a href="https://ipfs-search.com" target="_blank">ipfs-search.com</a>
          </li>
          <li>
            <strong>Pastebin.</strong> Create and share any text format.
          </li>
          <li>
            <strong>Chat.</strong> Create an encrypted P2P chat room for free communication between people you trust.
          </li>
        </ul>
      </div>
    </Box>

    <Box id="down" :title="`😨 What if ${$config.name} goes down?`">
      <div class="prose">
        <p>{{ $config.name }} itself is a web page stored in IPFS!</p>

        <p>This means that even if <span v-tooltip="'Official URL.'" class="tip">dreamlink.cloud</span> goes down you can still use it from other addresses or better yet, if you have an IPFS node on your computer or use a web browser like <a v-tooltip="'Web browser with integrated IPFS support.'" href="https://brave.com/" target="_blank">Brave</a>, you can download and use it at any time:</p>

        <Gateways />
      </div>
    </Box>

    <Box id="faq" title="❓ FAQ">
      <div class="space-y-3 prose">
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

          <p>Sorry but for now we do not keep a list of the files you have uploaded in the past.</p>

          <p>We recommend that you save the URL or <span v-tooltip="'A Content Identifier (CID) is a self-describing content-addressed label used to point to the data stored in IPFS. It is the core identifier used for IPFS and IPLD.'" class="tip">CID</span> of your files to return to them at any time, you can also re-upload the same files and you will get the same URL and CID without spending more storage space.</p>
        </details>

        <details>
          <summary class="title">
            Why do I have a small storage space?
          </summary>

          <p>The total storage space depends on your web browser and does not always mark the correct amount. (It is usually much larger)</p>

          <p>In case you need more space you can always use the <a href="#" @click.prevent="$bus.emit('node.dialog')">"Free up storage"</a> button to delete all the files you have uploaded in the past or you can access {{ $config.name }} in another web browser or gateway.</p>
        </details>
      </div>
    </Box>

    <Box title="🥰 Support">
      <p>If you like {{ $config.name }} you can show your support in the following ways, this will also allow us to create new versions with more features.</p>

      <div class="prose">
        <ul>
          <li><a href="https://www.patreon.com/bePatron?u=22042208" data-patreon-widget-type="become-patron-button">Become a Patron!</a></li>
          <li><a href="https://commerce.coinbase.com/checkout/24a8bcb6-22db-4166-9bea-fb24fe78f1cd" target="_blank">Donate with Coinbase</a></li>
          <!--<li>dreamnet.crypto</li>-->
          <li><b>BTC:</b> <InputPlus readonly value="18iqRVaETRcUgCnGeaT3EspPDJHPxAkWpt" input-class="input--sm" /></li>
          <li><b>ETH:</b> <InputPlus readonly value="0xdd3ccb03ec13ef6b36d58b62fc2462ce625bc454" input-class="input--sm" /></li>
          <li><b>LTC:</b> <InputPlus readonly value="LaQqVAECSDVejAhhwk8XRce6YCEYsfAvuR" input-class="input--sm" /></li>
          <li><b>ZIL:</b> <InputPlus readonly value="zil1nf5u7geagm0rpc0armd47rjd0terjcjauctz6k" input-class="input--sm" /></li>
          <li><b>BAT:</b> <InputPlus readonly value="0xdd3ccb03ec13ef6b36d58b62fc2462ce625bc454" input-class="input--sm" /></li>
          <li><b>BCH:</b> <InputPlus readonly value="18iqRVaETRcUgCnGeaT3EspPDJHPxAkWpt" input-class="input--sm" /></li>
          <li><b>DAI:</b> <InputPlus readonly value="0xdd3ccb03ec13ef6b36d58b62fc2462ce625bc454" input-class="input--sm" /></li>
          <li><b>XMR:</b> <InputPlus readonly value="87ePGFG3ioZckJmNwPNatJaEbvAQoL49kiJrdhYcAjwsadG2CVJCiN2Jo8CqX5YFHH6J7fx9qtirWQv9DqBwzunH3SjY9Si" input-class="input--sm" /></li>
          <li><b>DOGE:</b> <InputPlus readonly value="DN4CknBXKhScFvkPVvraDosFrt4S5Mk8JP" input-class="input--sm" /></li>
          <li><b>BTT:</b> <InputPlus readonly value="TL7ttndKtBkL3rjQ7Sv89ZFmJAb8xDKGnY" input-class="input--sm" /></li>
          <li><b>LINK:</b> <InputPlus readonly value="0xdd3ccb03ec13ef6b36d58b62fc2462ce625bc454" input-class="input--sm" /></li>
          <li><b>FIL:</b> <InputPlus readonly value="f167goxu4nw3b4ewt2gsjc7dfhugm5gjfymaijdpy" input-class="input--sm" /></li>
        </ul>
      </div>
    </Box>
  </div>
</template>

<style lang="scss" scoped>
.about {
  @apply mx-auto space-y-6 max-w-prose;

  a {
    @apply text-primary underline;
  }

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