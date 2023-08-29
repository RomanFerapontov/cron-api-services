exports.up = async function (knex) {
  await knex.schema.createTable('transactions', function (table) {
    table.increments('id').primary();
    table.integer('block_number');
    table.string('block_hash');
    table.string('from_address');
    table.string('to_address');
    table.string('value');
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTable('transactions');
};
