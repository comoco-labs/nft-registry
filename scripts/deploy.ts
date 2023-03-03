import { ethers } from "hardhat";

async function main() {
  const TokenRegistry = await ethers.getContractFactory("TokenRegistry");
  const registry = await TokenRegistry.deploy();

  await registry.deployed();

  console.log(`TokenRegistry deployed to ${registry.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
