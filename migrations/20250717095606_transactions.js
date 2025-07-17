/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("transactions", (table) => {
    table.increments("id");
    table
      .integer("from_account_id")
      .unsigned()
      .references("id")
      .inTable("accounts")
      .onDelete("CASCADE");
    table
      .integer("to_account_id")
      .unsigned()
      .references("id")
      .inTable("accounts")
      .onDelete("CASCADE");
    table.decimal("amount").notNullable();
    table.timestamp("transacted_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("transactions");
};
