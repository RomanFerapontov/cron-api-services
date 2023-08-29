module.exports = {
  etherscanApiUrl: 'https://api.etherscan.io/api',
  connections: {
    postgres: {
      user: 'db_user_name',
      password: 'db_password',
      host: 'localhost',
      database: 'db_name',
      port: 5432,
    },
    migrations: {
      directory: __dirname + '/db/migrations',
    },
  },
};
