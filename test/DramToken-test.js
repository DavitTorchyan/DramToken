const { expect } = require("chai");
const {
  ethers: {
    getContractFactory,
    BigNumber,
    getNamedSigners
  }, ethers
} = require("hardhat");
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");

describe("DramToken", function () {

  let accounts;
  let deployer, owner, caller;
  let dram;

  beforeEach(async function() {
    accounts = await ethers.getSigners();
    ([deployer, owner, caller ] = accounts);
    const DramToken = await ethers.getContractFactory("DramToken");
    dram = await DramToken.deploy();
    await dram.deployed();    
    await dram.connect(deployer).mint(deployer.address, ethers.utils.parseUnits("1000"));
  });

  it("Should deploy with correct args: ", async function() {
    expect(await dram.name()).to.equal("DramToken");
    expect(await dram.symbol()).to.equal("AMD");
  });

  it("Should mint correct amount: ", async function() {
    await dram.connect(deployer).mint(owner.address, ethers.utils.parseUnits("1000"));
    expect(await dram.balanceOf(owner.address)).to.equal(ethers.utils.parseUnits("1000"));
  })

  it("Should emit event mint: ", async function() {
    await expect(dram.mint(owner.address, ethers.utils.parseUnits("1000"))).to.emit(dram, "Minted").withArgs(owner.address, ethers.utils.parseUnits("1000"));
  })

  it("Should burn correct amount: ", async function() {
    const deployerBalance = await dram.balanceOf(deployer.address); 
    await dram.connect(deployer).burn(deployer.address, ethers.utils.parseUnits("100"));
    expect(await dram.balanceOf(deployer.address)).to.equal(BigNumber.from(deployerBalance).sub(ethers.utils.parseUnits("100")));
  })

  it("Should emit event burn: ", async function() {
    await expect(dram.burn(deployer.address, ethers.utils.parseUnits("100"))).to.emit(dram, "Burned").withArgs(deployer.address, ethers.utils.parseUnits("100"));
  })

});  