const MyToken = artifacts.require("MyToken");
const HTLC = artifacts.require("HTLC")
const Web3 = require("web3")
const path = require("path");
const dotenv = require('dotenv');
result = dotenv.config({ path: path.resolve("../.env") });
if (result.error) {
    console.log("Fail to load .env varilable: migrations.2_deploy_contracts")
    throw result.error
}

module.exports = async function (deployer, network, accounts) {
    console.log(`Deployer accounts: ${accounts}`)
    await deployer.deploy(MyToken, Web3.utils.toWei("10000"))
    const cflToken = await MyToken.deployed()
    const balance = await cflToken.balanceOf(accounts[0])
    console.log(`Deployer is ${accounts[0] === process.env.ADDRESS_ERIC ? "ERIC" : "YUKO"}`)
    console.log(`network: ${network}`)
    console.log(`reciepient is ${accounts[0] === process.env.ADDRESS_ERIC ? process.env.ADDRESS_YUKO : process.env.ADDRESS_ERIC} `)
    console.log(`token address: ${cflToken.address}`)
    await deployer.deploy(
        HTLC, 
        accounts[0] === process.env.ADDRESS_ERIC ? process.env.ADDRESS_YUKO : process.env.ADDRESS_ERIC,
        cflToken.address,
        balance.toString()
    )
    const HTLCinstance = await HTLC.deployed()    
    await cflToken.approve(HTLCinstance.address, balance.toString())
    await HTLCinstance.fund()    
};