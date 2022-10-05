# Avalanche DEX example

Avalanche DEX Example

- [Companion Article](https://blog.infura.io/post/comparing-nft-standards-erc-721-vs-erc-721a-vs-erc-1155)
- [Sign up for a free account with Infura](https://infura.io/register?utm_source=github&utm_medium=devcommunity&utm_campaign=2022_Jul_devrel-sample-projects_content_content).
- [Getting Started with Infura](https://blog.infura.io/post/getting-started-with-infura-28e41844cc89)

## Module 1: Setup

Setting up your local development environment.

### Prerequisites

Basic Setup:

- [NodeJS](https://nodejs.org/en/) version 16 or above
- [Visual Studio Code](https://code.visualstudio.com/)
- [Git Bash](https://git-scm.com/downloads)
- [Bash on VS Code](https://www.shanebart.com/set-default-vscode-terminal/)

Add env config:

```bash
npx yarn add dotenv
```

Add the Infura credentials:

```text
# Secret recovery phrase - NEVER EVER SHARE
MNEMONIC= Add your 12 word secret phrase to access your assets on Ethereum. Never share these! Wrap in qoutations.

# Infura Project details
INFURA_PROJECT_ID= Add your secret here. (No qoutations)
INFURA_PROJECT_SECRET=Add your ID here. (No quotations)

```

### MetaMask Setup

First, install MetaMask on your browser. If you are already a MetaMask user, it's suggested to create a new browser profile for development purposes and install a separate instance of MetaMask.

See this article to create a [new Chrome profile](https://pureinfotech.com/add-new-user-profiles-google-chrome/), [Firefox](https://www.wikihow.com/Create-a-Firefox-Profile) or [Brave Browser](https://community.brave.com/t/brave-multi-user-accounts/119425).

Go to [https://metamask.io/download/](https://metamask.io/download/)] and choose your browser.

Set up your wallet. **Remember to save your secret recovery phrase in a secure location**. Due to how blockchains are created, the secret recovery phrase CAN NOT be reset. Since MetaMask is a non-custodial wallet, they do not hold a copy for you.

### Infura Setup

Next, you will need to [set up a free account with Infura](https://infura.io/register?utm_source=github&utm_medium=devcommunity&utm_campaign=2022_Jul_devrel-sample-projects_content_content).

![infura-signup.png](img/infura-signup.png)

Next, select a project. We will create two projects.

First, select Ethereum project.

![create-new-project.png](img/create-new-project.png)

Choose the Rinkeby Test Network. It' easier to view test net NFTs on this network via OpenSea.

![eth-creds-infura-rinkeby](img/eth-creds-infura-rinkeby.png)

Access your credentials. The project ID can be akin to your username, and the project secret a password.

![eth-creds-infura](img/eth-creds-infura.png)

Next, create a new project and choose IPFS.
You will save both these credentials into an .env file.

![ipfs-creds-infura](img/ipfs-creds-infura.png)


#### Install hdwallet-provider

Next, let's add the hierarchical deterministic wallet (HD Wallet). `hdwallet-provider` is a separate package that holds our keys and signs transactions for addresses derived from a 12 or 24-word mnemonic.

Note: that Infura does not manage your private keys. So, it cannot sign transactions on your behalf.

```bash
yarn add @truffle/hdwallet-provider
```

#### OpenZeppelin Contracts

Next up, let's add the OpenZeppelin Contracts. OpenZeppelin is a library for secure smart contract development. It allows developers to build on a solid foundation of community-vetted code.

This is important because smart contracts can hold enormous amounts of value and are immutable.

```bash
npx yarn add @openzeppelin/contracts
```

#### Truffle config

Now, let's configure our Truffle set up. This will allow us to connect Truffle to Infura and access the Ethereum Network.

This particular network, `Rinkeby`, is test network. Test networks are used to deploy contract for testing for free. This allows developers to experiment with contracts conditions that mirror the Ethereum Mainnet where Ether is worth real money.

Open `truffle.config.js` and modify `truffle-config.js` with the following code:

```javascript
// add at the top of truffle-config.js

require("dotenv").config(); // allows usage of .env file to store secrets
const HDWalletProvider = require('@truffle/hdwallet-provider'); // holds secret mnemonic for your Ethereum address
const infuraURL = 'https://rinkeby.infura.io/v3/' + INFURA_PROJECT_ID; // end point to join network
const mnemonic = process.env.MNEMONIC;

//...
// inside networks value
networks: {
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, infuraURL),
      network_id: 4, // Rinkeby's id
      gas: 5500000, // Rinkeby has a lower block limit than mainnet
      confirmations: 2, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    },
},
//...
// inside compilers
 compilers: {
    solc: {
      version: '0.8.13'
    }
};
```

#### Fund Deployment Account

Finally, let get some free Ether to process transactions on the Rinkeby test network.

Ether is required because:

- Without it, public networks accessible by all would run into DDOS attacks.
- Being able to upload arbitraty logic opens up the network to the the halting problem.
- independent network operators require incentivization to process computation on the network and pay for their operating costs.

Luckily, for our test networks, Ether is free.

Go to [faucet.paradigm.xyz/](https://faucet.paradigm.xyz/) and add your address to claim Rinkeby Ether.

## Module 3: Deployment

Now we can deploy our contract to Rinkeby test network!

```bash
truffle migrate --network 
```

### Update .env file

Let's update our `.env` file to account for our NFT metadata:

```text
# Address of the deployed smart contract
CONTRACT_ADDRESS="0x47DC746F41c5dB584e5A6ccf15c2c161560cD0F7"
```

### Module 4: Interacting with the DEX

Now let's work with our deployed dex and ERC-20 token contracts to:
- Approve the contract
- Bootstrap liquidity
- Deposit to the Liquidity Pool(LP)
- Swap our token for ETH

#### Approve the DEX contract

Run the following script to approve the ERC-20 token on the DEX.

```bash
npx truffle exec scripts/approveContract.js --network 
```

This script will create a web3.js Contract object for the deployed ERC-20 token contract, `AvaxTestToken.sol` that calls the approve() function `contractToken.methods.approve` 
and approves the deployed Dex contract to spend the ERC-20 token, Avax Test Token, in your wallet, up to the specified allowance.  This should emit an event which is
then logged out to console.

```bash
Event: Approval
Owner: 0xdf997dd8d5ecb45f4568bEF6791B0E59c2A51886
Spender: 0x726eD59088fcB5874d2d0cB4e458D326755CCF27
Value: 10000

AvaxTestToken balance: 99987.434999733274405172
Dex Allowance: 10000
```

#### Bootstrap liquidity on the DEX contract

Run the following script to bootstrap the DEX with an initial pool of liquidity.

```bash
npx truffle exec scripts/initDex.js --network 
```

This script will create a web3.js Contract object that calls the `payable` init() function `contractDex.methods.init` on the deployed Dex contract, 
`Dex.sol` and bootstraps the Dex contract with initial liquidity consisting of 1-to-1 ERC-20 token, Avax Test Token, and ETH.  This should emit an event which is
then logged out to console.

```
Transaction Hash: 0x3613dcb9531c469ab2d1a7bd8d0888ef1a09377cb62576f24d2586cf2c7e905e

Dex Liquidity: 1
```

#### Deposit to the LP on the DEX contract

Run the following script to deposit your token pair TAVAX/ETH to the DEX LP.

```bash
npx truffle exec scripts/depositLP.js --network 
```

This script will create a web3.js Contract object that calls the `payable` deposit() function `contractDex.methods.deposit` on the deployed Dex contract,
`Dex.sol` and deposits to the existing TAVAX/ETH LP with a 1-to-1 ratio of ERC-20 token, Avax Test Token, and ETH.  This should emit a `LiquidityProvided`
event which is then logged out to console.

```
Event: LiquidityProvided
Liquidity Provider: 0xdf997dd8d5ecb45f4568bEF6791B0E59c2A51886
TAVAX Deposited: 1.251485871078270025 TAVAX
ETH Deposited: 1 ETH

Dex Liquidity: 13.754457613234810075
```

#### Swap ETH for TAVAX

Run the following script to swap ETH for TAVAX using the DEX.

```bash
npx truffle exec scripts/swapEthForTavax.js --network 
```

This script will create a web3.js Contract object that calls the `payable` ethToToken() function `contractDex.methods.ethToToken` on the deployed Dex contract,
`Dex.sol` and uses the existing TAVAX/ETH LP to swap ETH for the ERC-20 token, Avax Test Token.  This should emit a `EthToTokenSwap`
event which is then logged out to console.

```
Event: EthToTokenSwap
Swapper: 0xdf997dd8d5ecb45f4568bEF6791B0E59c2A51886
Tx Details: Eth to Balloons
ETH Input: 1
Token Output: 1.437382812323980889

Dex Liquidity: 13.754457613234810075

ETH Balance(After Swap): 975.941305858221052478
AvaxTestToken balance(After Swap): 99984.154906454427853183
```

Congrats! You have just created a liquidity pool(LP) in a dex, deposited into a token/ETH pair on the dex and swapped your token for ETH and vice versa!  You have taken some
big steps in your DeFi developer journey

