const { expect } = require("chai");
const {
  ethers: {
    getContractFactory,
    BigNumber,
    getNamedSigners
  }, ethers
} = require("hardhat");
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");

describe("BuyToken", function () {

  let accounts;
  let deployer, owner, caller;
  let token, ethBalance, tokenBalance, tx;

  beforeEach(async function() {
    accounts = await ethers.getSigners();
    ([deployer, owner, caller ] = accounts);
    const DramToken = await ethers.getContractFactory("DramToken");
    dram = await DramToken.deploy();
    await dram.deployed();    
    const BuyToken = await ethers.getContractFactory("BuyToken");
    buytoken = await BuyToken.deploy(dram.address);
    await buytoken.deployed();
    await dram.transferOwnership(buytoken.address);
    // await dram.connect(deployer).mint(deployer.address, ethers.utils.parseUnits("1000"));
  });

  it("Should buy correct amount of tokens: ", async function() {
    await buytoken.connect(deployer).buy({from: deployer.address, value: ethers.utils.parseUnits("1")});
    expect(await dram.balanceOf(deployer.address)).to.equal(ethers.utils.parseUnits("1"));
  })

  it("Should emit buy event: ", async function() {
    await expect(buytoken.connect(deployer).buy({from: deployer.address, value: ethers.utils.parseUnits("1")})).to.emit(buytoken, "Buy").withArgs(deployer.address, ethers.utils.parseUnits("1"));
  })

  it("Should sell correct amount: ", async function() {
    await buytoken.connect(deployer).buy({from: deployer.address, value: ethers.utils.parseUnits("10")});
    const tokenBalance = await dram.balanceOf(deployer.address);
    const ethBalance = await ethers.provider.getBalance(deployer.address);
    await buytoken.connect(deployer).sell(ethers.utils.parseUnits("1"));  
    expect(await dram.balanceOf(deployer.address)).to.equal(BigNumber.from(tokenBalance).sub(ethers.utils.parseUnits("1")));
    // expect(await ethers.provider.getBalance(deployer.address)).to.equal(BigNumber.from(ethBalance).add(ethers.utils.parseUnits("1")));
  });

  it("Should be reverted with Error: ", async function() {
    await buytoken.connect(deployer).buy({from: deployer.address, value: ethers.utils.parseUnits("10")});
    await expect(buytoken.connect(deployer).sell(ethers.utils.parseUnits("11"))).to.be.revertedWith("Error");
  });

  it("Should withdraw correctly: ", async function() { 
    await buytoken.connect(deployer).buy({from: deployer.address, value: ethers.utils.parseUnits("10")});
    const ethBalance = await ethers.provider.getBalance(buytoken.address);
    expect(await ethers.provider.getBalance(buytoken.address)).to.equal(ethers.utils.parseUnits("10"));
    await buytoken.connect(deployer).withdraw();
    // expect(await ethers.provider.getBalance(buytoken.address)).to.equal(BigNumber.from(ethBalance).add(ethers.utils.parseUnits("10")));
  })

  it("Should emit event withdraw: ", async function() {
    await buytoken.connect(deployer).buy({from: deployer.address, value: ethers.utils.parseUnits("10")});
    await expect(buytoken.connect(deployer).withdraw()).to.emit(buytoken, "Withdraw").withArgs(ethers.utils.parseUnits("10"));
  })

});
