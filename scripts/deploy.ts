import { ethers } from "hardhat";

async function main() {
  const TokenRegistry = await ethers.getContractFactory("TokenRegistry");
  const tx = TokenRegistry.getDeployTransaction({
    gasPrice: 100000000000,
    gasLimit: 800000
  });

  const sig = {
    v: 27,
    r: "0x1234123412341234123412341234123412341234123412341234123412341234",
    s: "0x1234123412341234123412341234123412341234123412341234123412341234"
  };

  const raw = ethers.utils.serializeTransaction(tx);
  const digest = ethers.utils.keccak256(raw);
  const deployer = ethers.utils.recoverAddress(digest, sig);
  console.log(`Prefund the single-use deployer account ${deployer}`);

  const addr = ethers.utils.getContractAddress({from: deployer, nonce: 0});
  console.log(`Contract to be deployed at address ${addr}`);

  const request = ethers.utils.serializeTransaction(tx, sig);
  const response = await ethers.provider.sendTransaction(request);
  console.log(`Deployment transaction at hash ${response.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
