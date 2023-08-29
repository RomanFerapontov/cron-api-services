'use strict';

const { fetch } = require('../utils/fetch');
const { etherscanApiUrl } = require('../../../config');
const db = require('../libs/db');

const cronStart = async function (action, interval) {
  const start = async function () {
    try {
      const getLastBlock = await fetch(`${etherscanApiUrl}?module=proxy&action=eth_blockNumber`);
      const lastBlockNumber = parseInt(getLastBlock.result, 16);
      const lastSavedBlock = await db('transactions').orderBy('id', 'desc').first();
      const startBlockNumber = lastSavedBlock?.block_number || 17583000;
      console.log(`Reading started from block: ${startBlockNumber}`);

      for (let i = startBlockNumber; i <= lastBlockNumber; i++) {
        const tag = '0x' + i.toString(16);
        const url = `${etherscanApiUrl}?module=proxy&action=eth_getBlockByNumber&tag=${tag}&boolean=true`;
        const blocks = await fetch(url);
        const transactions = blocks.result.transactions || [];
        if (transactions.length > 0) await action(transactions);
      }
    } catch (error) {
      console.error(error);
    } finally {
      cronStart(action, interval);
      console.log('New interval started...');
    }
  }
  setTimeout(start, interval);
  // await start()
};

module.exports = {
  cronStart,
};
