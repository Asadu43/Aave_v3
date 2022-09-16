import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract, BigNumber, Signer, utils, constants } from "ethers";
import { parseEther, poll } from "ethers/lib/utils";
import hre, { ethers, network } from "hardhat";
import Web3 from "web3";
import { ILendingPoolV2 } from "../../typechain/ILendingPoolV2";
import { Impersonate} from "../utils/utilities";
var abi = require('ethereumjs-abi');
var util = require('ethereumjs-util')

let data:any;

const web3 = new Web3();
const UNISWAPV2_FACTORY = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';

 const USDC_TOKEN = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';

const WETH_TOKEN =  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';

describe("Aave Token", function () {
  let signer: SignerWithAddress;
  let user: SignerWithAddress;
  let user2: SignerWithAddress;

  let pool: Contract;
  let erc20Token: Contract;
  let usdtToken: Contract;
  let raiToken: Contract;
  let flashLoanReceiver: Contract;
  let addContract:Contract;
  let hAave:Contract;
  let feeRuleRegistry:Contract;
  let registry:Contract;
  let hMock:Contract;
  let proxyMock:Contract;
  let lendingPoolV2:Contract;
  let provider:Contract;
  let lendingPoolAddress:Contract;
  let faucet:Contract
  let tokenProvider:any;


  const dai  = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const usdt = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  const usdc = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const hdrn = "0xF2E3A6Ba8955B345a88E5013D9a299c0E83a787e";

  const busd = "0x4Fabb145d64652a948d72533023f6E7A623C7C53";
  const rai = "0x03ab458634910AaD20eF5f1C8ee96F1D6ac54919";
  const bat = "0x7abE0cE388281d2aCF297Cb089caef3819b13448";

 const AAVEPROTOCOL_V2_PROVIDER = '0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5';


  before(async () => {
    signer = await Impersonate("0x06920C9fC643De77B99cB7670A944AD31eaAA260");
    user = await Impersonate("0xa4b8339D2162125b33A667b0D40aC5dec27E924b");

    hre.tracer.nameTags[signer.address] = "ADMIN";
    // hre.tracer.nameTags[user.address] = "USER1";
    // hre.tracer.nameTags[user2.address] = "USER2";

    pool = await ethers.getContractAt("IPool", "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9", signer);
    erc20Token = await ethers.getContractAt("IERC20", WETH_TOKEN, signer);
    tokenProvider = await tokenProviderUniV2(erc20Token.address);


    raiToken = await ethers.getContractAt("IERC20", busd, signer);

    const FlashLoanReceiver = await ethers.getContractFactory("FlashLoanReceiver");
    flashLoanReceiver = await FlashLoanReceiver.deploy();

    const AddContract = await ethers.getContractFactory("AddContract");
    addContract = await AddContract.deploy();

    const HAaveProtocolV2 = await ethers.getContractFactory("HAaveProtocolV2");
    hAave = await HAaveProtocolV2.deploy();

    const FeeRuleRegistry = await ethers.getContractFactory("FeeRuleRegistry");
    feeRuleRegistry = await FeeRuleRegistry.deploy(parseEther("0.05"),signer.address)

    const Registry = await ethers.getContractFactory("Registry");
    registry = await Registry.deploy();

    const HMock = await ethers.getContractFactory("HMock");
    hMock = await HMock.deploy();


    const ProxyMock = await ethers.getContractFactory("ProxyMock");
    proxyMock = await ProxyMock.deploy(registry.address,feeRuleRegistry.address);

    const Faucet = await ethers.getContractFactory("Faucet");
    faucet = await Faucet.deploy();
  
    hre.tracer.nameTags[pool.address] = "POOL";
  });

  it("Functions", async function () {


    console.log(pool.address);
    console.log(hAave.address);
    await registry.register(hAave.address,ethers.utils.formatBytes32String("HAaveProtocolV2"))
    await registry.register(hMock.address,ethers.utils.formatBytes32String("HMock"))

    await registry.registerCaller(pool.address,"0xA2c157f6E49C744Da021E8f09FA4f87229F7fd8c000000000000000000000000")
    // await registry.register(signer.address,ethers.utils.formatBytes32String("Signer"))

    // console.log(feeRuleRegistry.functions);
    // console.log(registry.functions);



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

  // it("User Need To deposit Assests or Collateral", async () => {
  //   await expect(pool.deposit(dai, parseEther("500"), signer.address, 0)).to.be.revertedWith("SafeERC20: low-level call failed");
  // });

  // it("Approve Token For Deposit", async () => {
  //   await erc20Token.approve(pool.address, parseEther("1000"));
  // });

  // it("Deposit Token", async () => {
  //   await pool.deposit(WETH_TOKEN, parseEther("500"), signer.address, 0);
  // });

  // it("Deposit Token gearter than approve", async () => {
  //   await expect(pool.deposit(dai, parseEther("1000"), signer.address, 0)).to.be.revertedWith("SafeERC20: low-level call failed");
  // });

  // it("Borrow Token", async () => {
  //   await pool.borrow(rai, parseEther("25"), 2, 0, signer.address);
  // });

  // it("Borrow Token with Stable Rate", async () => {
  //   // stable borrowing not enabled == 12
  //   await expect(pool.borrow(rai, parseEther("25"), 1, 0, signer.address)).to.be.revertedWith("12");
  // });

  // it("Borrow Token", async () => {
  //   // 'There is not enough collateral to cover a new borrow' == 11
  //   await expect(pool.borrow(rai, parseEther("300"), 2, 0, signer.address)).to.be.revertedWith("11");
  // });

  // it("Borrow Token", async () => {
  //   // 'Action requires an active reserve' == 2
  //   await expect(pool.borrow(hdrn, parseEther("5"), 2, 0, signer.address)).to.revertedWith("2");
  // });

  // it("Repay Borrow Amount", async () => {
  //   await expect(pool.repay(rai, constants.MaxUint256, 2, signer.address)).to.be.revertedWith("SafeERC20: low-level call failed");
  // });

  // it("token Approve for repay", async () => {
  //   await raiToken.approve(pool.address, constants.MaxUint256);
  // });

  // it("liquidationCall (Health factor is not below the threshold)", async () => {
  //   // 'Health factor is not below the threshold'
  //   await expect(pool.liquidationCall(dai, rai, signer.address, constants.MaxUint256, true)).to.revertedWith("42");
  //   // await raiToken.approve(pool.address, constants.MaxUint256);
  // });

  // it("Repay Borrow Amount", async () => {
  //   await pool.repay(rai, constants.MaxUint256, 2, signer.address);
  // });

  // it("Borrow Token with Stable Rate", async () => {
  //   // stable borrowing not enabled == 12
  //   await expect(pool.borrow(rai, parseEther("25"), 1, 0, signer.address)).to.be.revertedWith("12");

  //   // console.log(await pool.MAX_STABLE_RATE_BORROW_SIZE_PERCENT());
  // });

  // it("Flashloan", async () => {
  //   // need to first give some token to contract which are using for fee deduction

  //   await raiToken.transfer(flashLoanReceiver.address, parseEther("10"));

  //   await pool.flashLoan(flashLoanReceiver.address, [rai], [parseEther("10000")], [0], signer.address, "0x10", 0);

  //   // LP_INVALID_FLASH_LOAN_EXECUTOR_RETURN
  // });

  // it("Simple FlashLoan",async () => {

  //   await raiToken.transfer(flashLoanSimpleReciver.address,parseEther("10"))

  //   await pool.flashLoanSimple(flashLoanSimpleReciver.address,rai,parseEther("100"),"0x",0)

  // })

  it("Withdraw Amount", async () => {


    await erc20Token.connect(tokenProvider).transfer(faucet.address,parseEther("100")
   )

    // await erc20Token.approve(faucet.address,parseEther("100"))
    // await pool.withdraw(dai, constants.MaxUint256, signer.address);

    // console.log(addContract.functions)
    // const params = _getParams(addContract.address,20,39);

    const params = _getFlashloanParams(
      [hMock.address],
      ["0x0000000000000000000000000000000000000000000000000000000000000000"],
      [faucet.address],
      [erc20Token.address],
      [parseEther("1")]
    );

    console.log(erc20Token.address)

    const data = _getFlashloanCubeData([erc20Token.address],[parseEther("1")],[parseEther("0")],params)

    const to = hAave.address;

    await proxyMock.execMock(to,data,{value:parseEther("1")})
    // console.log("hhhhhhhhhhhhhhhhh",data)

    // const sub = _getSubParams(50,2)

    // console.log("subdatavvvvvvvvvv",sub)
  });

});

let a:any;
let b:any;


function _getParams(address:string, a:any,b:any) {
  const data = [
    '0x' +
      abi
        .simpleEncode(
          'add(uint256,uint256)',
          a,
          b,
        )
        .toString('hex'),
  ];
  const configs = "0x0000000000000000000000000000000000000000000000000000000000000000"
  const params = web3.eth.abi.encodeParameters(
    ['address[]', 'bytes32[]', 'bytes[]'],
    [[address], [configs], data]
  );
  return params;
}

function _getFlashloanCubeData(assets:string[], amounts:any, modes:BigNumber[], params:any) {
  const data = abi.simpleEncode(
    'flashLoan(address[],uint256[],uint256[],bytes)',
    assets,
    ["1000000000"],
    [0],
    util.toBuffer(params)
  );
  return data;
}

function _getSubParams(a:any,b:any) {
   data = [
    '0x' +
      abi
        .simpleEncode(
          'sub(uint256,uint256)',
          a,
          b,
        )
        .toString('hex'),
  ];

  // const params = web3.eth.abi.encodeParameters(
  //   ['address[]', 'bytes32[]', 'bytes[]'],
  //   [a, b, data]
  // );
  // return params;
  return data;
}

function _getFlashloanParams(tos:any, configs:any, faucets:any, tokens:any, amounts:any) {
  const data = [
    '0x' +
      abi
        .simpleEncode(
          'drainTokens(address[],address[],uint256[])',
          faucets,
          tokens,
          [100000]
        )
        .toString('hex'),
  ];
  const params = web3.eth.abi.encodeParameters(
    ['address[]', 'bytes32[]', 'bytes[]'],
    [tos, configs, data]
  );
  return params;
}
async function tokenProviderUniV2(
  token0 = USDC_TOKEN,
  token1 = WETH_TOKEN,
  factoryAddress = UNISWAPV2_FACTORY
) {
  if (token0 === WETH_TOKEN) {
    token1 = USDC_TOKEN;
  }
  return _tokenProviderUniLike(token0, token1, factoryAddress);
}

async function _tokenProviderUniLike(token0:any, token1:any, factoryAddress:any) {
  const factory = await ethers.getContractAt("IUniswapV2Factory",factoryAddress);
  const pair = await factory.getPair(token0, token1);
 return impersonateAndInjectEther(pair);

}
async function impersonateAndInjectEther(address:any) {
  // Impersonate pair
  await network.provider.send('hardhat_impersonateAccount', [address]);

  // Inject 1 ether
  await network.provider.send('hardhat_setBalance', [
    address,
    '0xde0b6b3a7640000',
  ]);
  const account = await ethers.getSigner(address);
  return account;
}