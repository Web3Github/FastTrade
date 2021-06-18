const ethers = require('ethers');

// CONSTANTS DEFINITION NOTHING TO MODIFY
const addresses = {
  WBNB: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', // Wrapped BNB, we only swap with that on PSW
  router: '0x10ED43C718714eb63d5aA57B78B54704E256024E', // PSW2 Router address
}

// Function to configurate the tool
async function configurationTool (mnemonic, tokenToSwap, tokenDecimals, tokenAmount, providerWSS, recipient) {
  // Setting up values
  const mnemonic = mnemonic;
  const tokenToSwap = tokenToSwap;
  const recipient = recipient;
  const tokenDecimals = tokenDecimals;
  const tokenAmount = tokenAmount;
  const provider = new ethers.providers.WebSocketProvider(providerWSS)

  // Setting up basics
  const wallet = ethers.Wallet.fromMnemonic(mnemonic);
  const account = wallet.connect(provider);
  const router = new ethers.Contract(
    addresses.router,
    [
      'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
      'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
    ],
    account
  );
}

// Function to approve before swapping RUN THIS BEFORE IF YOU NEVER APPROVED SWAP
async function approveSwap () {

  const wbnb = new ethers.Contract(
    tokenToSwap,
    [
      'function approve(address spender, uint amount) public returns(bool)',
    ],
    account
  );

  const tx = await wbnb.approve(
    router.address, 
    ethers.constants.MaxUint256
  );
  const receipt = await tx.wait(); 
  console.log('Transaction receipt');
  console.log(receipt);

}

// FUNCTION TO SELL TOKEN
async function sellToken () {
  let tokenToSwap = tokenToSwap
  let toWBNB = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'; // WBNB Address

  const amountIn = ethers.utils.parseUnits(tokenAmount, tokenDecimals);
  const amounts = await router.getAmountsOut(amountIn, [tokenToSwap, toWBNB]);
  //Our execution price will be a bit different, we need some flexbility
  const amountOutMin = amounts[1].sub(amounts[1].div(10));
  console.log(`
    Selling token
    =================
    tokenIn: ${amountIn.toString()} ${tokenToSwap} (WBNB)
    tokenOut: ${amountOutMin.toString()} ${toWBNB}
  `);
  const tx = await router.swapExactTokensForETH(
    amountIn+1,
    amountOutMin,
    [tokenToSwap, toWBNB],
    recipient,
    Date.now() + 1000 * 60 * 10, //10 minutes
    {
      gasPrice: 5000000000,
      gasLimit: 1000000
    }
  );
  const receipt = await tx.wait(); 
  console.log('Transaction receipt');
  console.log(receipt);
}

module.exports = {
  sellToken,
  approveSwap,
  configurationTool
}
sellToken(tokenToSwap);
