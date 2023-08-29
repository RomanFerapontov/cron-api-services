module.exports = require('knex')({
    client: 'pg',
    connection: require('../../../config').connections.postgres,
});
