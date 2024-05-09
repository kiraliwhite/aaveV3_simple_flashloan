// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@aave/core-v3/contracts/interfaces/IPool.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

// AAVE V3闪电贷合约
contract AaveV3FlashloanReceiver {
    address public constant V3POOL_ADDRESS =
        0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2;
    address public constant WETH_ADDRESS =
        0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    address public assetAddress; //用於記錄借了什麼資產，應為WETH地址
    uint256 public borrowedAmount; //用於記錄借了多少錢

    constructor() {}

    // 閃電貸function，用flashLoanSimple只能借一種幣，這裡指定的是WETH，因此借出的是WETH，利息支付也是WETH
    function flashloan(uint256 wethAmount) external {
        //v3pool合約instance
        IPool v3Pool = IPool(V3POOL_ADDRESS);
        //呼叫v3pool合約的flashLoanSimple，借出WETH存到此合約內
        v3Pool.flashLoanSimple(address(this), WETH_ADDRESS, wethAmount, "", 0);
    }

    // 闪电贷回调函数，只能被 pool 合约调用
    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata
    ) external returns (bool) {
        // 确认调用的是 pool 合约
        require(msg.sender == V3POOL_ADDRESS, "not authorized");
        // 确认闪电贷发起者是本合约
        require(initiator == address(this), "invalid initiator");

        // flashloan 逻辑，這裡只是單純的紀錄借了多少錢，不做其他操作
        assetAddress = asset;
        borrowedAmount = amount;
        // flashloan费用的利息是amount的0.05%
        // 傳進來的premium是aave已經算好的利息費用，直接使用即可
        uint amountToRepay = amount + premium;

        // 归还闪电贷
        IERC20 weth = IERC20(WETH_ADDRESS);
        weth.approve(V3POOL_ADDRESS, amountToRepay);

        return true;
    }

    //查詢借了什麼資產，應為WETH地址
    function getAssetAddress() public view returns (address) {
        return assetAddress;
    }

    //查詢借了多少錢
    function getBorrowedAmount() public view returns (uint256) {
        return borrowedAmount;
    }

    //用於接收來自錢包的資金，作為利息支付給aave
    receive() external payable {}

    fallback() external payable {}
}
