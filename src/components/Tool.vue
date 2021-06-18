<template>
    <section>
        <b-field label="Adresse du token a swap">
            <b-input v-model="configuration.tokenToSwap"></b-input>
        </b-field>
        <b-field label="Decimales">
            <b-input type="number" v-model="configuration.tokenDecimals" disabled></b-input>
        </b-field>
        <b-field label="Montant de tokens">
            <b-input v-model="configuration.tokenAmount"></b-input>
        </b-field>
        <b-field label="Votre addresse (Wallet)">
            <b-input v-model="configuration.recipient"></b-input>
        </b-field>
        <b-field label="Seed phrase">
            <b-input type="password"
                v-model="configuration.seedPhrase"
                value=""
                password-reveal>
            </b-input>
        </b-field>
        <b-field label="Websocket provider (utiliser Ankr/etc...)">
            <b-input v-model="configuration.webSocketProvider"></b-input>
        </b-field>
        <div class="buttons">
            <b-button label="Approuver Swap" type="is-primary" @click="approveSwap()" expanded/>
            <b-button label="Vendre Token" type="is-primary" @click="sellToken()" expanded/>
        </div>
    </section>
</template>

<script>
import swapTool from '../bot2.js'

export default {
  name: 'Tool',
  data: function () {
    return {
      configuration : {
          tokenToSwap : null,
          tokenDecimals : 0,
          tokenAmount : null,
          recipient : null,
          seedPhrase : null,
          webSocketProvider : null
      }
    }
  },
  methods : {
    approveSwap :  function () {
        swapTool.approveSwap(
            this.configuration.seedPhrase,
            this.configuration.tokenToSwap,
            this.configuration.tokenDecimals,
            this.configuration.tokenAmount,
            this.configuration.webSocketProvider ? this.configuration.webSocketProvider : null
        );
    },
    sellToken :  function () {
        swapTool.sellToken(
            this.configuration.seedPhrase,
            this.configuration.tokenToSwap,
            this.configuration.tokenDecimals,
            this.configuration.tokenAmount,
            this.configuration.webSocketProvider ? this.configuration.webSocketProvider : null,
            this.configuration.recipient
        );
    }

  }
}
</script>
