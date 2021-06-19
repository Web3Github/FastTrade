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

// SETTING UP PROVIDER USING METAMASK
const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
const signer = provider.getSigner();

// SETTING UP PANCAKESWAP V2 ROUTER TO ACCESS TO SOME METHODS
const router = new ethers.Contract(
  addresses.router,
  [
    'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
    'function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
  ],
  signer
);

// FUNCTION TO APPROVE A TOKEN BEFORE SWAPING TO WBNB
async function approveSwap (_tokenToSwap) {
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
  console.log(`Transaction receipt : https://www.bscscan.com/tx/${receipt.transactionHash}`);

}

// FUNCTION TO GET BALANCEOF A TOKEN
async function balanceOf (_tokenToSwap) {
  const addressSigner = await signer.getAddress();

  // Setting up basics
  const wbnb = new ethers.Contract(
    _tokenToSwap,
    [
      'function balanceOf(address tokenOwner) external view returns (uint256)',
    ],
    signer
  );
  const tx = await wbnb.balanceOf(
    addressSigner
  );
  return tx.toString();
}

// FUNCTION TO SELL TOKEN
async function sellToken (_tokenToSwap, _tokenAmount, _inputGas) {
  const addressSigner = await signer.getAddress();

  if(_inputGas < 5 ){
    _inputGas = "5";
  }

  const amountIn = ethers.BigNumber.from(_tokenAmount);
  const _gasPrice = ethers.utils.parseUnits(_inputGas,'gwei')
  //const amounts = await router.getAmountsOut(amountIn, [_tokenToSwap, addresses.WBNB]);
  //Our execution price will be a bit different, we need some flexbility
  //const amountOutMin = amounts[1].sub(amounts[1].div(10));
  const tx = await router.swapExactTokensForETHSupportingFeeOnTransferTokens(
    amountIn,
    0,
    [_tokenToSwap, addresses.WBNB],
    addressSigner,
    Date.now() + 1000 * 60 * 10, //10 minutes
    {
      gasPrice: _gasPrice,
      gasLimit: 2000000 
    }
  );
  const receipt = await tx.wait();
  console.log(`Transaction receipt : https://www.bscscan.com/tx/${receipt.transactionHash}`);
}

module.exports = {
  sellToken,
  approveSwap,
  balanceOf
}