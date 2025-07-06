exports.up = (knex) =>
  knex.schema.createTable("logs", (table) => {
    table.increments("id").primary();
    table.enum("method", ["GET", "POST", "PUT", "DELETE"]).notNullable();
    table.string("url", 2048).notNullable();
    table.integer("statusCode").notNullable();
    table.string("ip", 45).notNullable();
    table.json("headers").notNullable();
    table.json("body").notNullable();
    table.timestamp("timestamp").defaultTo(knex.fn.now()).notNullable();
    table.integer("responseTime").notNullable();
  });

exports.down = (knex) => knex.schema.dropTable("logs");
