<template>
  <div class="about">
    <Box id="dreamlink" title="What is DreamLink?">
      <p>{{ $config.name }} is a small web application that provides you with a basic <a href="https://docs.ipfs.io/concepts/what-is-ipfs/" target="_blank">IPFS</a> node to easily upload and share files on a decentralized peer-to-peer network.</p>

      <p>{{ $config.name }} works similar to a file hosting but thanks to IPFS there are no server costs and your files are distributed by your web browser and other IPFS nodes around the world.</p>

      <p>{{ $config.name }} is ideal for free and fast file sharing.</p>
    </Box>

    <Box id="how" title="How it works?">
      <p>All the magic happens between you and your web browser, there are no servers in between that can process, track or censor your files!</p>

      <p>This is possible thanks to a decentralized network called IPFS, you can get more information about how it works <a href="https://docs.ipfs.io/concepts/how-ipfs-works/" target="_blank">here</a> but below is the summary of what happens when using {{ $config.name }}:</p>

      <div class="prose">
        <ul>
          <li>When you enter we give you a basic IPFS node whose <span v-tooltip="'The Datastore is the on-disk storage system used by an IPFS node.'" class="tip">DataStore</span> depends on the limits of your web browser. It is totally free and without installing anything.</li>

          <li>When you upload a file your IPFS node split the file into several <span v-tooltip="'A Block is a binary blob of data, identified by a CID.'" class="tip">blocks</span> that stores inside your web browser and shows you a page with information, sharing links and the <span v-tooltip="'A Content Identifier (CID) is a self-describing content-addressed label used to point to the data stored in IPFS. It is the core identifier used for IPFS and IPLD.'" class="tip">CID</span> of your file.</li>

          <li>Almost instantly your IPFS node will start sharing the file you just uploaded with other IPFS nodes around the world, these nodes will store your file for a limited time so anyone can continue downloading it even if you disconnect.</li>

          <li>Your IPFS node will continue to live and share all the files you have uploaded as long as you have a {{ $config.name }} tab open.</li>
        </ul>
      </div>
    </Box>

    <Box id="faq" title="FAQ">
      <div class="space-y-3 prose">
        <details>
          <summary class="title">
            Is it safe to upload files in {{ $config.name }}?
          </summary>

          <p>Yes, however it depends on what you consider safe.</p>

          <p>OpenDreamNet does not store your files on private servers, they stay within your web browser's storage and on IPFS nodes around the world.</p>

          <p>IPFS is a peer-to-peer protocol so please note the following:</p>

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
            What if {{ $config.name }} goes down?
          </summary>

          <p>{{ $config.name }} itself is a web page stored in IPFS!</p>

          <p>This means that even if <span v-tooltip="'Official URL.'" class="tip">dreamlink.cloud</span> goes down you can still use it from other addresses or better yet, if you have an IPFS node on your computer or use a web browser like <a v-tooltip="'Web browser with integrated IPFS support.'" href="https://brave.com/" target="_blank">Brave</a>, you can download and use it at any time:</p>

          <Gateways />

          <p>Your files will probably be stored on several IPFS nodes around the world so a {{ $config.name }} crash will not affect them.</p>
        </details>

        <details>
          <summary class="title">
            Why do I have a small storage space?
          </summary>

          <p>The total storage space depends on your web browser and may increase as you use it.</p>

          <p>In case you need more space you can always use the <a href="#" @click.prevent="$bus.emit('node.dialog')">"Free up storage"</a> button to delete all the files you have uploaded in the past or you can access {{ $config.name }} in another web browser or gateway.</p>
        </details>
      </div>
    </Box>

    <Box title="Support">
      <p>If you like {{ $config.name }} you can show your support in the following ways, this will also allow us to create new versions with more features.</p>

      <div class="prose">
        <ul>
          <li><a href="https://www.patreon.com/bePatron?u=22042208" data-patreon-widget-type="become-patron-button">Become a Patron!</a></li>
          <li><a href="https://commerce.coinbase.com/checkout/24a8bcb6-22db-4166-9bea-fb24fe78f1cd" target="_blank">Donate with Coinbase</a></li>
          <!--<li>dreamnet.crypto</li>-->
          <li><b>BTC:</b> <InputPlus value="18iqRVaETRcUgCnGeaT3EspPDJHPxAkWpt" /></li>
          <li><b>ETH:</b> <InputPlus value="0xdd3ccb03ec13ef6b36d58b62fc2462ce625bc454" /></li>
          <li><b>LTC:</b> <InputPlus value="LaQqVAECSDVejAhhwk8XRce6YCEYsfAvuR" /></li>
          <li><b>ZIL:</b> <InputPlus value="zil1nf5u7geagm0rpc0armd47rjd0terjcjauctz6k" /></li>
          <li><b>BAT:</b> <InputPlus value="0xdd3ccb03ec13ef6b36d58b62fc2462ce625bc454" /></li>
          <li><b>BCH:</b> <InputPlus value="18iqRVaETRcUgCnGeaT3EspPDJHPxAkWpt" /></li>
          <li><b>DAI:</b> <InputPlus value="0xdd3ccb03ec13ef6b36d58b62fc2462ce625bc454" /></li>
          <li><b>XMR:</b> <InputPlus value="87ePGFG3ioZckJmNwPNatJaEbvAQoL49kiJrdhYcAjwsadG2CVJCiN2Jo8CqX5YFHH6J7fx9qtirWQv9DqBwzunH3SjY9Si" /></li>
          <li><b>DOGE:</b> <InputPlus value="DN4CknBXKhScFvkPVvraDosFrt4S5Mk8JP" /></li>
          <li><b>BTT:</b> <InputPlus value="TL7ttndKtBkL3rjQ7Sv89ZFmJAb8xDKGnY" /></li>
          <li><b>LINK:</b> <InputPlus value="0xdd3ccb03ec13ef6b36d58b62fc2462ce625bc454" /></li>
          <li><b>FIL:</b> <InputPlus value="f167goxu4nw3b4ewt2gsjc7dfhugm5gjfymaijdpy" /></li>
        </ul>
      </div>
    </Box>
  </div>
</template>

<style lang="scss" scoped>
.about {
  @apply mx-auto space-y-6;
  max-width: 500px;

  a {
    @apply text-primary underline;
  }

  details {
    summary {
      @apply text-lg cursor-pointer;
    }
  }
}

.tip {
  @apply text-primary cursor-help border-b border-dotted;
}
</style>

<style lang="scss">
.prose {
  @apply text-snow;

  h1 {
    @apply text-snow-lighter;
  }

  h2 {
    @apply text-snow-light;
  }

  a {
    @apply text-primary;
  }

  b, strong {
    @apply text-snow-light;
  }
}
</style>
