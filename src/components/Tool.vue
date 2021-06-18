<template>
    <section>
        <b-field label="Adresse du token a swap">
            <b-input v-model="configuration.tokenToSwap"></b-input>
        </b-field>
        <b-field label="Gas Fee">
            <b-input v-model="configuration.inputGas"></b-input>
        </b-field>
        <b-field :label="configuration.currentBalanceOfToken">
            <b-input v-model="configuration.tokenAmount"></b-input>
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
          inputGas : 5,
          tokenAmount : null,
          currentBalanceOfToken : "Montant de token (UINT256)",
      }
    }
  },
  methods : {
    approveSwap :  function () {
        swapTool.approveSwap(
            this.configuration.tokenToSwap
        );
    },
    sellToken :  function () {
        swapTool.sellToken(
            this.configuration.tokenToSwap,
            this.configuration.tokenDecimals,
            this.configuration.tokenAmount,
            this.configuration.inputGas
        );
    },
  }
}
</script>
