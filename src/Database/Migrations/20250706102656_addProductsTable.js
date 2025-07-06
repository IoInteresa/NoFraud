exports.up = (knex) =>
  knex.schema.createTable("products", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.boolean("isActive").defaultTo(true);
    table.timestamps(true, true);
  });

exports.down = (knex) => knex.schema.dropTable("products");
