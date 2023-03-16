// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract OwnableToken is ERC721, Ownable {

    constructor() ERC721("OwnableToken", "OT") {}

}
