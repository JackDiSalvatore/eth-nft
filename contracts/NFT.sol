// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721 {
    constructor(address _deployer) ERC721("MyNFT", "NFT") {
        uint256 totalSupply = 100;

        for (uint256 i = 0; i < totalSupply; i++) {
            _mint(_deployer, i);
        }
    }
}
