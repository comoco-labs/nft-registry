import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

const chain = { network: "Polygon", id: 137 };
const secondaryTokenAddress = "0xDEAdBEEf00000000000000000123456789ABCdeF";

describe("TokenRegistry", function () {

  async function deployContractsFixture() {
    const [owner, other] = await ethers.getSigners();

    const TokenRegistry = await ethers.getContractFactory("TokenRegistry");
    const registry = await TokenRegistry.deploy();

    const OwnableToken = await ethers.getContractFactory("OwnableToken");
    const ownableToken = await OwnableToken.deploy();

    const NonOwnableToken = await ethers.getContractFactory("NonOwnableToken");
    const nonOwnableToken = await NonOwnableToken.deploy();

    return { registry, ownableToken, nonOwnableToken, owner, other };
  }

  describe("Validations", function () {
    it("Should revert if register an invalid address", async function () {
      const { registry } = await loadFixture(deployContractsFixture);

      await expect(registry.setSecondaryTokenAddress(ethers.constants.AddressZero, chain, secondaryTokenAddress))
        .to.be.revertedWith("Invalid address");
    });

    it("Should revert if register a non-ownable contract", async function () {
      const { registry, nonOwnableToken } = await loadFixture(deployContractsFixture);

      await expect(registry.setSecondaryTokenAddress(nonOwnableToken.address, chain, secondaryTokenAddress))
        .to.be.revertedWithoutReason();
    });

    it("Should revert if register an ownable contract not from the owner", async function () {
      const { registry, ownableToken, other } = await loadFixture(deployContractsFixture);

      await expect(registry.connect(other).setSecondaryTokenAddress(ownableToken.address, chain, secondaryTokenAddress))
        .to.be.revertedWith("Unauthorized request");
    });

    it("Shouldn't fail if register an ownable contract from the owner", async function () {
      const { registry, ownableToken } = await loadFixture(deployContractsFixture);

      await expect(registry.setSecondaryTokenAddress(ownableToken.address, chain, secondaryTokenAddress))
        .not.to.be.reverted;
    });
  });

  describe("Events", function () {
    it("Should emit an event on setSecondaryTokenAddress", async function () {
      const { registry, ownableToken } = await loadFixture(deployContractsFixture);

      await expect(registry.setSecondaryTokenAddress(ownableToken.address, chain, secondaryTokenAddress))
         .to.emit(registry, "SecondaryTokenAddressChanged")
         .withArgs(ownableToken.address, anyValue, secondaryTokenAddress);
    });
  });

  describe("Registers", function () {
    it("Should register and be able to getSecondaryTokenAddress", async function () {
      const { registry, ownableToken } = await loadFixture(deployContractsFixture);

      await registry.setSecondaryTokenAddress(ownableToken.address, chain, secondaryTokenAddress);

      expect(await registry.getSecondaryTokenAddress(ownableToken.address, chain))
        .to.equal(secondaryTokenAddress);
    });
  });

});
