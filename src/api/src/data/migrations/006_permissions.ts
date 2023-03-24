import * as knex from "knex";

exports.up = function (knex: knex.Knex, Promise: any) {
  console.log("Created permission_scopes table");
  return knex.schema.createTable("permissions", function (t) {
    t.increments("id").notNullable().primary();
    t.string("email").notNullable();
    t.string("name").notNullable();
    t.string("operation").notNullable();
    t.string("relevant_entity").notNullable();
    t.string("relevant_id").nullable();
    t.string("relevant_entity_type").notNullable();
    t.timestamp("create_date").notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function (knex: knex.Knex, Promise: any) {
  console.log("Dropped permission_scopes table");
  return knex.schema.dropTable("permissions");
};
