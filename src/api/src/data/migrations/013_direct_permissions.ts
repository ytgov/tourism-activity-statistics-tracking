import * as knex from "knex";

exports.up = function (knex: knex.Knex, Promise: any) {
  console.log("Created direct_permissions table");
  return knex.schema.createTable("direct_permissions", function (t) {
    t.increments("id").notNullable().primary();
    t.string("email").notNullable().unique();
    t.string("scopes");
    t.string("created_by");
    t.timestamp("create_date").notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function (knex: knex.Knex, Promise: any) {
  console.log("Dropped direct_permissions table");
  return knex.schema.dropTable("direct_permissions");
};
