exports.up = function (knex) {
  return knex.schema.createTable("accounts", (table) => {
    table.increments("id");
    table.string("number", 9).notNullable();
    table.string("pin_code", 6).notNullable();
    table.decimal("balance", 10).notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("accounts");
};
