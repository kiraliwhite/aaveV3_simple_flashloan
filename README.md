# Simple aave V3 flashloan

1. 使用hardhat node分叉以太坊主網到本地區塊鏈
```shell
yarn hardhat node --fork https://eth-mainnet.g.alchemy.com/v2/<Your alchemy API KEY>
```

2. 打開另外一個終端機，透過hardhat ignition部署_AaveV3FlashloanReceiver_合約到本地區塊鏈
```shell
yarn hardhat ignition deploy ignition/modules/AaveV3FlashloanReceiver.js --network localhost
```

3. 當合約部署完成之後，終端機上會顯示Deployed Addresses，將顯示的_AaveV3FlashloanReceiver_合約地址，貼到scripts/aaveBorrow.js中。替換掉原本flashloanReceiverAddress變數的值


4. 打開另外一個終端機，執行yarn hardhat run，使用script與部署好的合約互動。
```shell
yarn hardhat run scripts/aaveBorrow.js --network localhost
```
