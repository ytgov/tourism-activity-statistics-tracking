import * as knex from "knex";

exports.up = function (knex: knex.Knex, Promise: any) {
  console.log("Created visitor_centre_season table");

  return knex.schema.createTable("visitor_centre_season", function (t) {
    t.increments("id").primary();
    t.integer("visitor_centre_id").notNullable().references("visitor_centre.id");
    t.string("year", 4).notNullable();
    t.date("open_date").notNullable();
    t.date("close_date").notNullable();
    t.integer("projected_visitors").notNullable().defaultTo(-1);
    t.string("notes", 2000).nullable();
  });
};

exports.down = function (knex: knex.Knex, Promise: any) {
  console.log("Dropped visitor_centre_season table");

  return knex.schema.dropTable("visitor_centre_season");
};
