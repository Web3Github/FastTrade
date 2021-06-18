<template>
    <section>
        <b-field label="Adresse du token a swap">
            <b-input v-model="configuration.tokenToSwap"></b-input>
        </b-field>
        <b-field label="Decimales">
            <b-input type="number" v-model="configuration.tokenDecimals" disabled></b-input>
        </b-field>
        <b-field :label="configuration.currentBalanceOfToken">
            <b-input v-model="configuration.tokenAmount"></b-input>
        </b-field>
        <a :href="tokenContractAddress">Balance of</a><br>

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
            <b-button label="Refresh token amount" type="is-primary" @click="balanceOf()" expanded disabled/>
            <b-button label="Acheter Token" type="is-primary" expanded disabled/>
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
          webSocketProvider : null,
          currentBalanceOfToken : "Montant de token (UINT256)",
      }
    }
  },
  computed : {
      tokenContractAddress : function () {
          let tokenContractAddress = "https://bscscan.com/token/"+this.configuration.tokenToSwap+"#readContract"
          return tokenContractAddress
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
    },
    balanceOf :  function () {
    this.currentBalanceOfToken = this.currentBalanceOfToken + swapTool.balanceOfToken(
        this.configuration.seedPhrase,
        this.configuration.tokenToSwap,
        this.configuration.webSocketProvider ? this.configuration.webSocketProvider : null,
        this.configuration.recipient
    );
}

  }
}
</script>
