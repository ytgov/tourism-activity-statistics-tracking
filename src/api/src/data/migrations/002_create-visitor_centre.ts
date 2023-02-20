import * as knex from "knex";

exports.up = function (knex: knex.Knex, Promise: any) {
  console.log("Created visitor_centre table");

  return knex.schema.createTable("visitor_centre", function (t) {
    t.increments("id").primary();
    t.string("name", 200).notNullable().unique();
    t.string("community", 200).notNullable();
    t.string("region", 200).notNullable();
    t.boolean("is_active").notNullable().defaultTo(true);
  });
};

exports.down = function (knex: knex.Knex, Promise: any) {
  console.log("Dropped visitor_centre table");

  return knex.schema.dropTable("visitor_centre");
};
