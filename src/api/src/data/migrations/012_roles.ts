import * as knex from "knex";

exports.up = function (knex: knex.Knex, Promise: any) {
  console.log("Created roles table");
  return knex.schema.createTable("roles", function (t) {
    t.increments("id").notNullable().primary();
    t.string("role").notNullable();
    t.string("scopes");
    t.string("created_by");
    t.timestamp("create_date").notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function (knex: knex.Knex, Promise: any) {
  console.log("Dropped roles table");
  return knex.schema.dropTable("roles");
};
