const { Web3 } = require('web3');
const cron = require('node-cron');
const HDWalletProvider = require('@truffle/hdwallet-provider');

// Node.js version: 14.17.0

// Initialize your mnemonic and Infura API key
const mnemonic = 'infant museum emotion clinic raven fruit butter disease exact cradle aunt tattoo';
const infuraApiKey = '5ad571252f5143f4bd89e8a99823b5c8';

// Set the wallet address you want to sweep from and the destination address
const fromAddress = '0xE9466f174eF967C23ebc42E0C29E705f0faC70ec';
const destinationAddress = '0xAa873aBa0D4A05f172D1C3287b044Fa271c32dA4';

async function sweepWallet() {
  try {
    const provider = new HDWalletProvider({
      mnemonic: {
        phrase: mnemonic
      },
      providerOrUrl: `https://mainnet.infura.io/v3/${infuraApiKey}`
    });

    const web3 = new Web3(provider);
    const balance = await web3.eth.getBalance(fromAddress);
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 21000; // Standard gas limit for a simple transaction

    console.log(`Balance of ${fromAddress}: ${web3.utils.fromWei(balance, 'ether')} ETH`);
    console.log(`Gas Price: ${web3.utils.fromWei(gasPrice, 'gwei')} Gwei`);

    const transactionCount = await web3.eth.getTransactionCount(fromAddress);
    const txObject = {
      from: fromAddress,
      to: destinationAddress,
      value: web3.utils.toWei(balance,'ether'),
      gasPrice: web3.utils.toHex(gasPrice),
      gas: gasLimit,
      nonce: transactionCount
    };

    const signedTx = await web3.eth.signTransaction(txObject);
    const txReceipt = await web3.eth.sendSignedTransaction(signedTx.raw);

    console.log('Transaction hash:', txReceipt.transactionHash);
    console.log('Transaction complete!');
  } catch (error) {
    console.error('An error occurred:', error.error.message);
  }
}

cron.schedule("*/1 * * * * *", function() {
  sweepWallet();
});

// Call the sweepWallet function
