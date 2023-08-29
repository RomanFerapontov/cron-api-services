'use strict';

const { getBalanceChanges, getMostChangedBalanceAddress } = require('./etherscan');
const { parentPort, workerData } = require('worker_threads');

async function getMaxChangeAddress() {
  try {
    const balanceChanges = await getBalanceChanges();
    return getMostChangedBalanceAddress(balanceChanges);
  } catch (error) {
    console.error(error);
  }
}

(async () => {
  const result = await getMaxChangeAddress(workerData);
  parentPort.postMessage(result);
})();
