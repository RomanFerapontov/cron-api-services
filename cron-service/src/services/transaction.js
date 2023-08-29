'use strict';

const db = require('../libs/db');

module.exports = {
  async saveTransactions(transactions) {
    try {
      for (let { blockNumber, blockHash, from, to, value } of transactions) {
        const transactionData = {
          from_address: from,
          to_address: to,
          value,
          block_number: parseInt(blockNumber, 16),
          block_hash: blockHash,
        };

        const existsRow = await db('transactions').where(transactionData).first();
       
        if (!existsRow) await db('transactions').insert(transactionData);
       
        console.log(`Writed: from address ${from} to address ${to} amount ${value}`);
      }
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  },
};
