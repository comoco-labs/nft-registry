// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NonOwnableToken is ERC721 {

    constructor() ERC721("NonOwnableToken", "NOT") {}

}
