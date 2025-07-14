exports.up = async (knex) => {
  await knex.schema.alterTable('products', (table) => {
    table.integer('pipelineId').nullable();
  });

  await knex('products').update({ pipelineId: 1 });

  await knex.schema.alterTable('products', (table) => {
    table.integer('pipelineId').notNullable().alter();
  });
};

exports.down = (knex) => knex.schema.alterTable('products', (table) => {
  table.dropColumn('pipelineId');
});