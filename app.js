const { cronServiceStart } = require('./cron-service/app');
const serverStart = require('./api-service/server');
const db = require('./cron-service/src/libs/db');

(async () => {
    await db.migrate.latest();
    await cronServiceStart(60000);
    serverStart();
})();
