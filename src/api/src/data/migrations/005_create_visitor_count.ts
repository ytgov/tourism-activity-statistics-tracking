import * as knex from "knex";

exports.up = function (knex: knex.Knex, Promise: any) {
  console.log("Created visitor_count table");

  return knex.schema.createTable("visitor_count", function (t) {
    t.increments("id").primary();
    t.integer("visitor_centre_id").notNullable().references("visitor_centre.id");
    t.integer("visitor_origin_id").notNullable().references("visitor_origin.id");
    t.timestamp("date").notNullable();
    t.integer("count").notNullable().defaultTo(1);
  });
};

exports.down = function (knex: knex.Knex, Promise: any) {
  console.log("Dropped visitor_count table");

  return knex.schema.dropTable("visitor_count");
};
