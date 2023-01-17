import * as knex from "knex";

// Not going to do this quite yet. I need to think about how to do this.
exports.up = function (knex: knex.Knex, Promise: any) {
  console.log("Created aliases table");
  return knex.schema.createTable("aliases", function (t) {
    t.increments("id").notNullable().primary();
    t.string("alias").notNullable();

    t.string("created_by");
    t.timestamp("create_date").notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function (knex: knex.Knex, Promise: any) {
  console.log("Dropped aliases table");
  return knex.schema.dropTable("aliases");
};
