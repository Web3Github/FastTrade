const ethers = require('ethers');

// CONSTANTS DEFINITION NOTHING TO MODIFY
const addresses = {
  WBNB: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', // Wrapped BNB, we only swap with that on PSW
  router: '0x10ED43C718714eb63d5aA57B78B54704E256024E', // PSW2 Router address
}

// Function to approve before swapping RUN THIS BEFORE IF YOU NEVER APPROVED SWAP ------ WORKING 
async function approveSwap (_tokenToSwap) {

  // Setting up values
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  // Setting up basics
  const wbnb = new ethers.Contract(
    _tokenToSwap,
    [
      'function approve(address spender, uint amount) public returns(bool)',
    ],
    signer
  );
  const tx = await wbnb.approve(
    addresses.router, 
    ethers.constants.MaxUint256
  );
  const receipt = await signer.sendTransaction(tx); 
  console.log('Transaction receipt');
  console.log(receipt);

}

// FUNCTION TO SELL TOKEN
async function sellToken (_tokenToSwap, _tokenDecimals, _tokenAmount,_inputGas) {
  if(_inputGas < 5 ){
    console.log('kek');
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const addressSigner = await signer.getAddress();
  // Setting up basics
  let router = new ethers.Contract(
    addresses.router,
    [
      'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
      'function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
    ],
    signer
  );

  //const amountIn = ethers.utils.parseUnits(_tokenAmount, _tokenDecimals);
  const amountIn = ethers.BigNumber.from(_tokenAmount);
  const _gasPrice = ethers.utils.parseUnits(_inputGas,'gwei')
  const amounts = await router.getAmountsOut(amountIn, [_tokenToSwap, addresses.WBNB]);
  //Our execution price will be a bit different, we need some flexbility
  const amountOutMin = amounts[1].sub(amounts[1].div(10));
  console.log(`
    Selling token
    =================
    tokenIn: ${amountIn.toString()} ${_tokenToSwap}
    tokenOut: ${amountOutMin.toString()} ${addresses.WBNB}
  `);
  const tx = await router.swapExactTokensForETHSupportingFeeOnTransferTokens(
    amountIn,
    amountOutMin,
    [_tokenToSwap, addresses.WBNB],
    addressSigner,
    Date.now() + 1000 * 60 * 10, //10 minutes
    {
      gasPrice: _gasPrice,
      gasLimit: 2000000 
    }
  );
  const receipt = await tx.wait();
  console.log(receipt);
}

module.exports = {
  sellToken,
  approveSwap
}