const { expect } = require("chai");

describe("Lottery", () => {
  let lottery;
  let lotteryDeploy;
  let addr1;
  let addr2;
  let addr3;
  let addr4;
  let address;
  beforeEach(async () => {
    lottery = await ethers.getContractFactory("Lottery");
    [addr1, addr2, addr3, addr4, ...address] = await ethers.getSigners();
    lotteryDeploy = await lottery.deploy();
    await lotteryDeploy
      .connect(addr2)
      .takePart({ value: ethers.utils.parseEther("0.01") });
    await lotteryDeploy
      .connect(addr3)
      .takePart({ value: ethers.utils.parseEther("0.01") });
    await lotteryDeploy
      .connect(addr4)
      .takePart({ value: ethers.utils.parseEther("0.01") });
  });
  describe("no. of participants", () => {
    it("length of array", async () => {
      const num = await lotteryDeploy.length();
      expect(num).to.equal(3);
    });
  });
  describe("Function Randomness", () => {
    it("random number", async () => {
      await lotteryDeploy.randomWinner();
    });
  });
  describe("calling Winner Function", () => {
    it("Checking winner", async () => {
      await lotteryDeploy.winnerPay();
      const num = await lotteryDeploy.length();
      expect(num).to.equal(0);
    });
  });
});
