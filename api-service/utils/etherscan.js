'use strict';
const { fetch } = require('./fetch');
const { etherscanApiUrl } = require('../../config');

module.exports = {
  async getBalanceChanges() {
    try {
      const lastBlockUrl = `${etherscanApiUrl}?module=proxy&action=eth_blockNumber`;
      const { result } = await fetch(lastBlockUrl);
      const lastBlock = parseInt(result, 16);
      const startBlock = Math.max(0, lastBlock - 101);

      const blocks = Array(100);

      for (let j = 0; j <= 99; j++) {
        blocks[j] = startBlock + 1;
      }

      const balances = new Map();

      const getBalances = async (block) => {
        try {
          const blockNumber = '0x' + block.toString(16);
          const blockUrl = `${etherscanApiUrl}?module=proxy&action=eth_getBlockByNumber&tag=${blockNumber}&boolean=true`;
          const { result } = await fetch(blockUrl);

          if (result && result.transactions) {
            for (let tx of result.transactions) {
              if (tx.from && tx.to && tx.value) {
                const from = tx.from.toLowerCase();
                const to = tx.to.toLowerCase();
                const value = parseInt(tx.value, 16);

                balances.set(from, (balances.get(from) || 0) - value);
                balances.set(to, (balances.get(to) || 0) + value);
              }
            }
          }
          
        } catch (error) {
          console.error(error);
        }
      };

      await Promise.all(blocks.map((block) => getBalances(block)));

      return balances;
    } catch (error) {
        console.error(error);
    }
  },

  async getMostChangedBalanceAddress(balanceChanges) {
    let maxChangeAddress = null;
    let maxChangeValue = 0;

    for (const [address, balanceChange] of balanceChanges) {
      if (Math.abs(balanceChange) > maxChangeValue) {
        maxChangeAddress = address;
        maxChangeValue = Math.abs(balanceChange);
      }
    }
    return { maxChangeAddress, maxChangeValue };
  },
};
