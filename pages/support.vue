<template>
  <div class="support">
    <Box title="Support">
      <p>If you like {{ $config.name }} you can show your support in the following ways, this will also allow us to create new versions with more features.</p>
    </Box>

    <Box title="Patreon">
      <a href="https://www.patreon.com/bePatron?u=22042208" data-patreon-widget-type="become-patron-button">Become a Patron!</a>
      <script async src="https://c6.patreon.com/becomePatronButton.bundle.js" />
    </Box>

    <Box title="Crypto Donation">
      <div class="prose">
        <ul>
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
.support {
  @apply mx-auto space-y-6;
  max-width: 65ch;

  a {
    @apply text-primary underline;
  }

  details {
    summary {
      @apply text-lg cursor-pointer;
    }
  }
}
</style>
