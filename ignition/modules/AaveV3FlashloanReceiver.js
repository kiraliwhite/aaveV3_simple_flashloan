const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("AaveV3FlashloanReceiverModule", (m) => {
  const aaveV3FlashloanReceiver = m.contract("AaveV3FlashloanReceiver", [], {});

  return { aaveV3FlashloanReceiver };
});
