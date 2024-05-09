const wethABI = require("../contracts/abis/IWETH.json");
const { ethers } = require("hardhat");

async function main() {
  //用於支付利息的費用
  const feesAmount = ethers.parseEther("1");
  //自己部署的flashloanReceiver合約地址
  const flashloanReceiverAddress = "0x8Aed6FE10dF3d6d981B101496C9c7245AE65cAEc";

  const [account0] = await ethers.getSigners();
  //console.log("Account0:", account0.address);

  const flashloanReceiver = await ethers.getContractAt(
    "AaveV3FlashloanReceiver",
    flashloanReceiverAddress,
    account0
  );

  const weth = await ethers.getContractAt(
    wethABI,
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    account0
  );

  //呼叫WETH合約的deposit方法，將1個ETH存入合約，就會自動轉成WETH存到錢包內，這是用於支付閃電貸"利息"的費用。
  //利息為貸款金額的0.05%，即5/10000，用1WETH來支付利息絕對夠
  const tx = await weth.deposit({ value: feesAmount });
  await tx.wait();

  //使用WETH合約的transfer方法，將WETH從錢包轉給flashloanReceiver合約，作為貸款利息放在合約內。
  const transferTx = await weth.transfer(flashloanReceiverAddress, feesAmount);
  await transferTx.wait();

  //檢查合約地址內有WETH可用於支付利息
  const wethBalance = await weth.balanceOf(flashloanReceiverAddress);
  console.log(`FlashloanReceiver WETH balance: ${wethBalance.toString()}`);

  //呼叫閃電貸function，這裡借了100顆WETH
  const flashloanTx = await flashloanReceiver.flashloan(
    ethers.parseEther("100")
  );
  await flashloanTx.wait();

  //檢查借出的資產確實是WETH 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
  const assetAddress = await flashloanReceiver.getAssetAddress();
  console.log(`Asset address: ${assetAddress}`);

  //檢查借出的資產數量，是100顆WETH
  const borrowAmount = await flashloanReceiver.getBorrowedAmount();
  console.log(`borrowAmount: ${borrowAmount}`);
}

main();
