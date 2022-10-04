pragma solidity >=0.8.0 <0.9.0;
// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AvaxTestToken is ERC20 {
    constructor() ERC20("Avax Test Token", "TAVAX") {
        _mint(msg.sender, 100000 ether); // mints 1000 tokens!
    }
}
