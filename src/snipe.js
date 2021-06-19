const ethers = require('ethers');

// CONSTANTS DEFINITION NOTHING TO MODIFY
const addresses = {
  WBNB: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', // Wrapped BNB, we only swap with that on PSW
  router: '0x10ED43C718714eb63d5aA57B78B54704E256024E', // PSW2 Router address
  factory : '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73' // PSW2 Factory address
}

// When test net 
/* const addresses = {
  WBNB: '0xae13d989dac2f0debff460ac112a837c89baa7cd', // Wrapped BNB TEST NET
  router: '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3', // PSW2 Router address TESTNET
  factory: '0x6725F303b657a9451d8BA641348b6761A6CC7a17' // PSW Factory TESTNET
} */

const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
const signer = provider.getSigner();

//Setting up factory
const factory = new ethers.Contract(
    addresses.factory,
    [
      'event PairCreated(address indexed token0, address indexed token1, address pair, uint)',
      'function getPair(address tokenA, address tokenB) external view returns (address pair)'
    ],
    signer
  );
// Setting up router
let router = new ethers.Contract(
    addresses.router,
    [
      'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
      'function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
    ],
    signer
  );
  
// FUNCTION TO SNIPE TOKEN
async function snipeToken (_tokenToSwap, _minLiquidityBeforeBuy, _bnbAmountToSpend, _inputGas) {
  let initialLiquidityDetected = false;
  const addressSigner = await signer.getAddress();
  const pairAddress = await factory.getPair(addresses.WBNB, _tokenToSwap);
  const _gasPrice = ethers.utils.parseUnits(_inputGas,'gwei')
  const amountToBuy = _bnbAmountToSpend // in WBNB

  // Setting up BNB
  const wbnb = new ethers.Contract(
    _tokenToSwap,
    [
      'function balanceOf(address tokenOwner) external view returns (uint256)',
    ],
    signer
  );

  // Check liquidity of a pair
  const pair = new ethers.Contract(
    pairAddress, 
    ['event Mint(address indexed sender, uint amount0, uint amount1)']
    , signer);
  console.log('Bot running ..... Be patient....')  
  pair.on('Mint', async (sender, amount0, amount1) => {
    if(initialLiquidityDetected === true) {
      return;
    }
    initialLiquidityDetected = true;
    console.log(
      `Liquidity Addition Detected\n`
      +
      `Details
      =================
      sender: ${sender}
      amount0: ${amount0}
      amount1:${amount1}
    `);
    const pairBNBvalue = await wbnb.balanceOf(pairAddress);
    let rdblValue = await ethers.utils.parseUnits(`${pairBNBvalue}`, 'ether');
    //let minLiquidity = await ethers.utils.parseUnits(`${_minLiquidityBeforeBuy}`, 'ether')

    const amountIn = ethers.utils.parseUnits(`${amountToBuy}`, 'ether');
    // Buy Token on liquidity add
    console.log(
      `Buying Token\n`
      +
      `Details
      =================
      amountIn: ${amountIn} BNB
      GasPrice : ${_gasPrice} GWEI
      PairBNBValue : ${rdblValue}
      PairAddress : ${pairAddress}
      AdressSigner : ${addressSigner}
    `);
    //if(rdblValue > minLiquidity){
      setTimeout(async function(){
        const tx = await router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
          amountIn,
          0,
          [addresses.WBNB, _tokenToSwap],
          addressSigner,
          Date.now() + 1000 * 60 * 10, //10 minutes
          {
            'gasLimit': 200000,
            'gasPrice': _gasPrice,
            'nonce' : null
        });
        const receipt = await tx.wait(); 
        console.log(`Transaction receipt : https://www.bscscan.com/tx/${receipt.transactionHash}`);
      }, 3000);
  //}
  });
}
module.exports = {
  snipeToken
}