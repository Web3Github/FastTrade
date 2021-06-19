const ethers = require('ethers');

// CONSTANTS DEFINITION NOTHING TO MODIFY
/* const addresses = {
  WBNB: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', // Wrapped BNB, we only swap with that on PSW
  router: '0x10ED43C718714eb63d5aA57B78B54704E256024E', // PSW2 Router address
} */

// When test net 
const addresses = {
  WBNB: '0xae13d989dac2f0debff460ac112a837c89baa7cd', // Wrapped BNB TEST NET
  router: '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3', // PSW2 Router address TESTNET
  factory: '0x6725F303b657a9451d8BA641348b6761A6CC7a17' // PSW Factory TESTNET
}

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
      'function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
    ],
    signer
  );
  
// FUNCTION TO SNIPE TOKEN
async function snipeToken (_tokenToSwap, _minLiquidityBeforeBuy, _bnbAmountToSpend, _inputGas) {
  const addressSigner = await signer.getAddress();
  const minLiquidityOfToken = _minLiquidityBeforeBuy // IN BNB
  const amountToBuy = _bnbAmountToSpend // in WBNB
  let jmlBnb = 0;
  let initialLiquidityDetected = false;
  // Setting up BNB
  const wbnb = new ethers.Contract(
    _tokenToSwap,
    [
      'function balanceOf(address tokenOwner) external view returns (uint256)',
    ],
    signer
  );
  // Check liquidity of a pair
  const run = async () => { await checkLiq();}
  let checkLiq = async() => {
    console.log('test');
    const pairAddressx = await factory.getPair(_tokenToSwap, addresses.WBNB);
    console.log(`pairAddress: ${pairAddressx}`);
    if (pairAddressx !== null && pairAddressx !== undefined) {
      if (pairAddressx.toString().indexOf('0x0000000000000') > -1) {
        console.log(`pairAddress ${pairAddressx} not detected. Auto restart`);
        return await run();
      }
    }
    const pairBNBvalue = await wbnb.balanceOf(pairAddressx); 
    jmlBnb = await ethers.utils.formatEther(pairBNBvalue);
    console.log(`value BNB : ${jmlBnb}`);
  
    if(jmlBnb > minLiquidityOfToken){
        setTimeout(() => buyAction(), 3000);
    }
    else{
        initialLiquidityDetected = false;
        console.log(' run again...');
        return await run();
      }
  }
  //const amountIn = ethers.utils.parseUnits(_tokenAmount, _tokenDecimals);
  const _gasPrice = ethers.utils.parseUnits(_inputGas,'gwei')

  let buyAction = async() => {
    if(initialLiquidityDetected === true) {
      console.log('not buy cause already buy');
        return null;
    }
    
    console.log('ready to buy');
    try{
      initialLiquidityDetected = true;

      let amountOutMin = 0;
      //We buy x amount of the new token for our wbnb
      const amountIn = ethers.utils.parseUnits(`${amountToBuy}`, 'ether');
   
      console.log(
       `Start to buy \n`
        +
        `Buying Token
        =================
        tokenIn: ${(amountIn * 1e-18).toString()} ${addresses.WBNB} (BNB)
        tokenOut: ${amountOutMin.toString()} ${_tokenToSwap}
      `);
     
      console.log('Processing Transaction.....');
      console.log(`amountIn: ${(amountIn * 1e-18)} ${addresses.WBNB} (BNB)`);
      console.log(`amountOutMin: ${amountOutMin}`);
      console.log(`tokenIn: ${addresses.WBNB}`);
      console.log(`tokenOut: ${_tokenToSwap}`);
      console.log(`data.recipient: ${addressSigner}`);
      console.log(`data.gasLimit: ${2000000}`);
      console.log(`data.gasPrice: ${_gasPrice}`);

      const tx = await router.swapExactTokensForTokensSupportingFeeOnTransferTokens( 
        amountIn,
        amountOutMin,
        [addresses.WBNB, _tokenToSwap],
        addressSigner,
        Date.now() + 1000 * 60 * 5, //5 minutes
        {
          'gasLimit': 2000000,
          'gasPrice': _gasPrice
      });
     
      const receipt = await tx.wait(); 
      console.log(`Transaction receipt : https://www.bscscan.com/tx/${receipt.logs[1].transactionHash}`);
      setTimeout(() => {process.exit()},2000);
    }catch(err){
      let error = JSON.parse(JSON.stringify(err));
        console.log(`Error caused by : 
        {
        reason : ${error.reason},
        transactionHash : ${error.transactionHash}
        message : Please check your BNB/WBNB balance, maybe its due because insufficient balance or approve your token manually on pancakeSwap
        }`);
        console.log(error);
    }
  }
}
module.exports = {
  snipeToken
}