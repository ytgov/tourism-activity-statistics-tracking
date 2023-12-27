import * as knex from "knex";

exports.up = function (knex: knex.Knex, Promise: any) {
  return knex.schema.createTable("kiosk_data", function (t) {
    t.increments("id").notNullable().primary();
    t.string("kiosk_name").notNullable();
    t.date("start_date").notNullable();
    t.date("end_date").notNullable();
    t.string("playout_item", 100).notNullable();
    t.float("playout_count").nullable();
    t.float("playout_seconds").nullable();
  });
};

exports.down = function (knex: knex.Knex, Promise: any) {
  return knex.schema.dropTable("kiosk_data");
};
