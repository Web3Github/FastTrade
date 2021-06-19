<template>
<div>
    <div ref="navbar">
        <nav class="navbar level">
            <p class="level-item has-text-centered">
                <a class="link is-info is-active" @click="switchMode(0)">Sell Mode</a>
            </p>
            <h1 v-if="mode === 0" class="title level-item has-text-centered">Sell Mode</h1>
            <h1 v-else class="title level-item has-text-centered">Sniper bot - Buy</h1>
            <p class="level-item has-text-centered ">
                <a class="link is-info" @click="switchMode(1)">Sniper bot</a>
            </p>
        </nav>
    </div>
    <div ref="tool" class="is-flex is-justify-content-center">
        <section v-if="mode === 0">
            <b-field label="Token address">
                <b-input v-model="sellTool.tokenToSwap"></b-input>
            </b-field>
            <b-field label="Gas Fees">
                <b-numberinput
                min="5"
                step="1" 
                v-model="sellTool.inputGas"
                icon-pack="fas"
                ></b-numberinput>
            </b-field>  
            <b-field type="String" label="Amount of Token (UINT256)">
                <a v-if="sellTool.tokenToSwap" @click="setMaxAmount(balanceOf)">Vous possedez : {{balanceOf}} </a>
                <b-input v-model="sellTool.tokenAmount"></b-input>
            </b-field>
            <div class="buttons">
                <b-button label="Approve Swap" type="is-primary" @click="approveSwap()" expanded/>
                <b-button label="Sell Token" type="is-primary" @click="sellToken()" expanded/>
            </div>
        </section>
        <section v-if="mode === 1">
            <b-field label="Token address">
                <b-input v-model="snipeTool.tokenToSwap"></b-input>
            </b-field>
            <b-field label="Minimal liquidity of token before buy">
                <b-numberinput
                min="0"
                step="0.001" 
                v-model="snipeTool.minLiquidityBeforeBuy"
                icon-pack="fas"
                ></b-numberinput>
            </b-field>            
            <b-field label="Gas Fees">
                <b-numberinput
                min="5"
                step="1" 
                v-model="snipeTool.inputGas"
                icon-pack="fas"
                ></b-numberinput>
            </b-field>   
            <b-field label="Amount of BNB to spend">
                <b-numberinput
                min="0"
                step="0.001" 
                v-model="snipeTool.bnbAmountToSpend"
                icon-pack="fas"
                ></b-numberinput>
            </b-field>
            <div class="buttons">
                <b-button label="Snipe Token" type="is-primary" @click="snipeToken()" expanded/>
            </div>
        </section>
    </div>
</div>
</template>

<script>
import sellHelper from '../sell.js'
import snipeHelper from '../snipe.js'

export default {
  name: 'Tool',
  data: function () {
    return {
        sellTool : {
            tokenToSwap : null,
            inputGas : 5,
            tokenAmount : null,
            maxTokenAmount : null
        },
        snipeTool : {
            tokenToSwap : null,
            inputGas : 5,
            minLiquidityBeforeBuy : 3,
            bnbAmountToSpend : 0,
        },
        mode : 0,

    }
  },
  asyncComputed: {
    async balanceOf() {
        if(this.sellTool.tokenToSwap){
            return sellHelper.balanceOf(this.sellTool.tokenToSwap);
        }
    }
  },
  methods : {
    switchMode : function (_mode) {
        this.mode = _mode;
    },
    setMaxAmount : function (balance) {
        this.sellTool.tokenAmount = balance;
    },
    approveSwap :  function () {
        sellHelper.approveSwap(
            this.sellTool.tokenToSwap
        );
    },
    sellToken :  function () {
        sellHelper.sellToken(
            this.sellTool.tokenToSwap,
            this.sellTool.tokenAmount,
            this.sellTool.inputGas.toString()
        );
        this.sellTool.tokenToSwap = null;
        this.sellTool.tokenAmount = null;
    },
    
    snipeToken : function () {
        snipeHelper.snipeToken(
            this.snipeTool.tokenToSwap,
            this.snipeTool.minLiquidityBeforeBuy,
            this.snipeTool.bnbAmountToSpend,
            this.snipeTool.inputGas.toString()
        )
    }
  }
}
</script>
