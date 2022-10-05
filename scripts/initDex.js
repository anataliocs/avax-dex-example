require("dotenv").config();

const {PUBLIC_ADDRESS, CONTRACT_ADDRESS_TOKEN, CONTRACT_ADDRESS_DEX} = process.env;

// Loading the compiled contract Json
const dexJson = require("../build/contracts/Dex.json");
const tokenJson = require("../build/contracts/AvaxTestToken.json");

module.exports = async function (callback) {
    // web3 is injected by Truffle
    const contractDex = new web3.eth.Contract(
        dexJson.abi,
        CONTRACT_ADDRESS_DEX // this is the address generated when running migrate
    );

    const contractToken = new web3.eth.Contract(
        tokenJson.abi,
        CONTRACT_ADDRESS_TOKEN // this is the address generated when running migrate
    );

    // get the current network name to display in the log
    const network = await web3.eth.net.getNetworkType();

    const initTx = contractDex.methods.init(web3.utils.toWei('1', 'ether'));
    // Send the transaction to the network
    await initTx
        .send({
            value: web3.utils.toWei('1', 'ether'),
            from: (await web3.eth.getAccounts())[0],
            gasLimit: 200000
        })
        .then(function (receipt) {
            console.log("Transaction Hash: " + receipt.transactionHash);
        });

    await contractDex.methods.getLiquidity(PUBLIC_ADDRESS)
        .call()
        .then(function (receipt) {
            console.log("\nDex Liquidity: " + web3.utils.fromWei(receipt, 'ether'));
            callback();
        });
};
