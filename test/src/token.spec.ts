import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract, BigNumber, Signer, utils, constants } from "ethers";
import { parseEther, poll } from "ethers/lib/utils";
import hre, { ethers } from "hardhat";
import { Impersonate } from "../utils/utilities";

describe("Aave Token", function () {
  let signer: SignerWithAddress;
  let user: SignerWithAddress;
  let user2: SignerWithAddress;

  let pool: Contract;
  let erc20Token: Contract;
  let usdtToken: Contract;
  let raiToken: Contract;
  let flashLoanReceiver: Contract;

  const dai = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const usdt = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  const usdc = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const hdrn = "0xF2E3A6Ba8955B345a88E5013D9a299c0E83a787e";

  const busd = "0x4Fabb145d64652a948d72533023f6E7A623C7C53";
  const rai = "0x03ab458634910AaD20eF5f1C8ee96F1D6ac54919";
  const bat = "0x7abE0cE388281d2aCF297Cb089caef3819b13448";

  before(async () => {
    signer = await Impersonate("0x86f6ff8479c69E0cdEa641796b0D3bB1D40761Db");
    user = await Impersonate("0xa4b8339D2162125b33A667b0D40aC5dec27E924b");

    hre.tracer.nameTags[signer.address] = "ADMIN";
    // hre.tracer.nameTags[user.address] = "USER1";
    // hre.tracer.nameTags[user2.address] = "USER2";

    pool = await ethers.getContractAt("IPool", "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9", signer);
    erc20Token = await ethers.getContractAt("IERC20", dai, signer);
    raiToken = await ethers.getContractAt("IERC20", rai, signer);

    const FlashLoanReceiver = await ethers.getContractFactory("FlashLoanReceiver");
    flashLoanReceiver = await FlashLoanReceiver.deploy();

    hre.tracer.nameTags[pool.address] = "POOL";
  });

  it("Functions", async function () {
    // await raiToken.approve(pool.address,parseEther("1000"))
    // await raiToken.approve(pool.address,parseEther("1000"))
    // await pool.deposit(dai,parseEther("200"),signer.address,0);
    // await pool.setUserUseReserveAsCollateral(dai,false);
    // await pool.deposit(dai,parseEther("500"),signer.address,0);
    // await pool.supply(dai,parseEther("100"),signer.address,0)
    // await pool.deposit(usdc,parseEther("200"),signer.address,0);
    // await pool.borrow(usdt,parseEther("100"),2,0,signer.address)
    // console.log("Borrow..........");
    // await pool.borrow(busd,parseEther("50"),2,0,signer.address);
    // await pool.borrow(rai,parseEther("25"),2,0,signer.address);
    // await pool.borrow(rai,parseEther("25"),1,0,signer.address);
    // await pool.rebalanceStableBorrowRate(rai,signer.address)
    // console.log("Swap Borrow rate..........")
    // await pool.connect(signer).swapBorrowRateMode(rai,1);
    // console.log(await pool.getUserAccountData(signer.address));
    // await pool.liquidationCall(dai,rai,signer.address,constants.MaxUint256,false)
    // console.log("Repay..........");
    // await pool.withdraw(dai,constants.MaxUint256,signer.address)
    // console.log(await pool.getUserAccountData(signer.address));
  });

  it("User Need To deposit Assests or Collateral", async () => {
    await expect(pool.deposit(dai, parseEther("500"), signer.address, 0)).to.be.revertedWith("SafeERC20: low-level call failed");
  });

  it("Approve Token For Deposit", async () => {
    await erc20Token.approve(pool.address, parseEther("1000"));
  });

  it("Deposit Token", async () => {
    await pool.deposit(dai, parseEther("500"), signer.address, 0);
  });

  it("Deposit Token gearter than approve", async () => {
    await expect(pool.deposit(dai, parseEther("1000"), signer.address, 0)).to.be.revertedWith("SafeERC20: low-level call failed");
  });

  it("Borrow Token", async () => {
    await pool.borrow(rai, parseEther("25"), 2, 0, signer.address);
  });

  it("Borrow Token with Stable Rate", async () => {
    // stable borrowing not enabled == 12
    await expect(pool.borrow(rai, parseEther("25"), 1, 0, signer.address)).to.be.revertedWith("12");
  });

  it("Borrow Token", async () => {
    // 'There is not enough collateral to cover a new borrow' == 11
    await expect(pool.borrow(rai, parseEther("300"), 2, 0, signer.address)).to.be.revertedWith("11");
  });

  it("Borrow Token", async () => {
    // 'Action requires an active reserve' == 2
    await expect(pool.borrow(hdrn, parseEther("5"), 2, 0, signer.address)).to.revertedWith("2");
  });

  it("Repay Borrow Amount", async () => {
    await expect(pool.repay(rai, constants.MaxUint256, 2, signer.address)).to.be.revertedWith("SafeERC20: low-level call failed");
  });

  it("token Approve for repay", async () => {
    await raiToken.approve(pool.address, constants.MaxUint256);
  });

  it("liquidationCall (Health factor is not below the threshold)", async () => {
    // 'Health factor is not below the threshold'
    await expect(pool.liquidationCall(dai, rai, signer.address, constants.MaxUint256, true)).to.revertedWith("42");
    // await raiToken.approve(pool.address, constants.MaxUint256);
  });

  it("Repay Borrow Amount", async () => {
    await pool.repay(rai, constants.MaxUint256, 2, signer.address);
  });

  it("Borrow Token with Stable Rate", async () => {
    // stable borrowing not enabled == 12
    await expect(pool.borrow(rai, parseEther("25"), 1, 0, signer.address)).to.be.revertedWith("12");

    // console.log(await pool.MAX_STABLE_RATE_BORROW_SIZE_PERCENT());
  });

  it("Flashloan", async () => {
    // need to first give some token to contract which are using for fee deduction

    await raiToken.transfer(flashLoanReceiver.address, parseEther("10"));

    await pool.flashLoan(flashLoanReceiver.address, [rai], [parseEther("10000")], [0], signer.address, "0x10", 0);

    // LP_INVALID_FLASH_LOAN_EXECUTOR_RETURN
  });

  // it("Simple FlashLoan",async () => {

  //   await raiToken.transfer(flashLoanSimpleReciver.address,parseEther("10"))

  //   await pool.flashLoanSimple(flashLoanSimpleReciver.address,rai,parseEther("100"),"0x",0)

  // })

  it("Withdraw Amount", async () => {
    await pool.withdraw(dai, constants.MaxUint256, signer.address);
  });
});
