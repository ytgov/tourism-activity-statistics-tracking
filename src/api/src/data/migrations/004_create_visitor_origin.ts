import * as knex from "knex";

exports.up = function (knex: knex.Knex, Promise: any) {
  console.log("Created visitor_origin table");

  return knex.schema.createTable("visitor_origin", function (t) {
    t.increments("id").primary();
    t.string("name", 200).notNullable();
    t.string("region", 200).notNullable();
  });
};

exports.down = function (knex: knex.Knex, Promise: any) {
  console.log("Dropped visitor_origin table");

  return knex.schema.dropTable("visitor_origin");
};
