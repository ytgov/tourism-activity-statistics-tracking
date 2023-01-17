import * as knex from "knex";

exports.up = function (knex: knex.Knex, Promise: any) {
  console.log("Created permission_scopes table");
  return knex.schema.createTable("permission_scopes", function (t) {
    t.increments("id").notNullable().primary();
    t.string("scopes").notNullable();
    t.string("description");
    t.string("created_by");
    t.timestamp("create_date").notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function (knex: knex.Knex, Promise: any) {
  console.log("Dropped permission_scopes table");
  return knex.schema.dropTable("permission_scopes");
};
