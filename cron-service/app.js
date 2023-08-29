const { saveTransactions } = require('./src/services/transaction');
const { cronStart } = require('./src/services/cron');

module.exports = {
    cronServiceStart: async (interval) => {
        cronStart(saveTransactions, interval)
    }
}
