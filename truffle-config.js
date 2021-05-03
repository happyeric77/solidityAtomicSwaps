const HDWalletProvider = require("@truffle/hdwallet-provider");
path = require("path")
const dotenv = require('dotenv');
result = dotenv.config({ path: "./.env" });
if (result.error) {
    console.log("Fail to load .env varilable: truffle-config.js")
    throw result.error
}

console.log(`Phase is deploy: ${process.env.PHASE === "deploy"}`)

module.exports = {
  contracts_build_directory: path.join(__dirname, "src/contracts"),
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: '*' // Match any network id
    },
    kovan: {
      provider: ()=> new HDWalletProvider(
        process.env.PHASE === "deploy" ?  process.env.PRIVATE_KEY_ERIC : process.env.PRIVATE_KEY_YUKO, 
        "https://kovan.infura.io/v3/" + process.env.INFURA_API_KEY
      ),
      network_id: 42,
      skipDryRun: true,
    },

    /* Offical BSC doc & tools:
    ** truffle: https://docs.binance.org/smart-chain/developer/deploy/truffle.html
    ** developer: https://docs.binance.org/smart-chain/developer/rpc.html
    ** testnet faucet: https://testnet.binance.org/faucet-smart
    */ 
    bsctestnet: {
      provider: () => new HDWalletProvider(
        process.env.PHASE === "deploy" ?  process.env.PRIVATE_KEY_YUKO : process.env.PRIVATE_KEY_ERIC, 
        `https://data-seed-prebsc-1-s1.binance.org:8545`
        ),
      network_id: 97,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    bscmainnet: {
      provider: () => new HDWalletProvider(process.env.PRIVATE_KEY_YUKO, `https://bsc-dataseed1.binance.org`),
      network_id: 56,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },
  mocha: {
    reporter: 'eth-gas-reporter',
  },
  compilers: {
    solc: {
      version: "0.8.0",    // Fetch exact version from solc-bin (default: truffle's version)
    },
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}