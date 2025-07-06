exports.up = (knex) =>
  knex.schema.createTable("verifications", (table) => {
    table.increments("id").primary();
    table.string("phoneNumber").notNullable();
    table.integer("code").notNullable();
    table.boolean("isVerified").defaultTo(false);
    table
      .integer("productId")
      .references("id")
      .inTable("products")
      .notNullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now());
    table.timestamp("updatedAt").defaultTo(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable("verifications");
