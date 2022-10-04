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

    console.log(PUBLIC_ADDRESS);

    const isAddy = await web3.utils.isAddress(PUBLIC_ADDRESS);

    console.log(isAddy);

    // Generate a transaction to calls the `mint` function
    const tx1155 = contractToken.methods.mint(PUBLIC_ADDRESS, 20);
    // Send the transaction to the network
    await tx1155
        .send({
            from: (await web3.eth.getAccounts())[0], // uses the first account in the HD wallet
            gas: await tx1155.estimateGas(),
        })
        .on("transactionHash", (txhash) => {
            console.log(`Mining ERC-1155 transaction for 2 NFTs and fungible tokens ...`);
            console.log(`https://${network}.etherscan.io/tx/${txhash}`);
        })
        .on("error", function (error) {
            console.error(`An error happened: ${error}`);
            callback();
        })
        .then(function (receipt) {
            // Success, you've minted the NFT. The transaction is now on chain!
            console.log(
                `\n Success: ERC-20 NFTs tokens have been minted and mined in block ${receipt.blockNumber} which cost ${receipt.gasUsed} gas \n`
            );
            console.log("# of tokens transferred: " + receipt.events.Transfer.returnValues.value);

        });

    contractToken.methods.balanceOf(PUBLIC_ADDRESS)
        .call()
        .then(function (receipt) {
            console.log("AvaxTestToken balance: " + receipt);
            callback();
        });


};
