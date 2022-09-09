import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract, BigNumber, Signer, utils,constants } from "ethers";
import { parseEther } from "ethers/lib/utils";
import hre, { ethers } from "hardhat";
import { Impersonate } from "../utils/utilities";


describe("Aave Token", function () {

  let signer: SignerWithAddress;
  let user: SignerWithAddress;
  let user2:SignerWithAddress;

  let pool: Contract;
  let erc20Token:Contract;
  let usdtToken:Contract;
  let usdcToken:Contract;

  const dai  = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const usdt = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  const usdc = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const hdrn = "0xF2E3A6Ba8955B345a88E5013D9a299c0E83a787e";

  const busd = "0x4Fabb145d64652a948d72533023f6E7A623C7C53";
  const rai =  "0x03ab458634910AaD20eF5f1C8ee96F1D6ac54919";



  before(async () => {

    signer = await Impersonate("0x86f6ff8479c69E0cdEa641796b0D3bB1D40761Db");
    user = await Impersonate("0xa4b8339D2162125b33A667b0D40aC5dec27E924b");

    hre.tracer.nameTags[signer.address] = "ADMIN";
    // hre.tracer.nameTags[user.address] = "USER1";
    // hre.tracer.nameTags[user2.address] = "USER2";

     pool = await ethers.getContractAt("IPool","0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9",signer);
     erc20Token = await ethers.getContractAt("IERC20",dai,signer)
    //  usdtToken = await ethers.getContractAt("IERC20",usdt,signer)
     usdcToken = await ethers.getContractAt("IERC20",rai,signer)


    
    // pool = await IPool.deploy();

    hre.tracer.nameTags[pool.address] = "POOL";
  });


  it("Functions", async function () {

    await erc20Token.approve(pool.address,parseEther("1000"))

    await usdcToken.approve(pool.address,parseEther("1000"))

    // await usdcToken.approve(pool.address,parseEther("1000"))


    // await pool.deposit(dai,parseEther("200"),signer.address,0);

    await pool.deposit(dai,parseEther("100"),signer.address,0);
    // await pool.deposit(usdc,parseEther("200"),signer.address,0);

    // await pool.borrow(usdt,parseEther("100"),2,0,signer.address)

    console.log("Borrow..........")

    // await pool.borrow(busd,parseEther("77"),2,0,signer.address);
    await pool.borrow(rai,parseEther("25"),2,0,signer.address);


    console.log(await pool.getUserAccountData(signer.address));

    console.log("Repay..........")

    await pool.repay(rai,constants.MaxUint256,2,signer.address)

  })


});