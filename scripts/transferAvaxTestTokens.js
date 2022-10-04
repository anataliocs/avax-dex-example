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

    console.log(contractDex.options.address);

    // get the current network name to display in the log
    const network = await web3.eth.net.getNetworkType();

    const approve = contractToken.methods.approve(
        contractDex.options.address,
        web3.utils.toWei('10000', 'ether'));

    await approve
        .send({
            from: (await web3.eth.getAccounts())[0]
        })
        .then(function (receipt) {
            console.log("Event: " + receipt.events.Approval.event);
            console.log("Owner: " + receipt.events.Approval.returnValues.owner);
            console.log("Spender: " + receipt.events.Approval.returnValues.spender);
            console.log("Value: " + web3.utils.fromWei(receipt.events.Approval.returnValues.value, 'ether'));
        });

    await contractToken.methods.balanceOf(PUBLIC_ADDRESS)
        .call()
        .then(function (receipt) {
            console.log("\nAvaxTestToken balance: " + web3.utils.fromWei(receipt, 'ether'));
        });

    await contractToken.methods.allowance(PUBLIC_ADDRESS,contractDex.options.address)
        .call()
        .then(function (receipt) {
            console.log("Dex Allowance: " + web3.utils.fromWei(receipt, 'ether'));

        });


};
