import * as knex from "knex";

exports.up = async function (knex: knex.Knex, Promise: any) {
  console.log("Created schedule table");

  await knex.schema.alterTable("visitor_centre", (t) => {
    t.string("reminders_at", 500).nullable();
    t.string("reminders_when", 50).nullable();
  });

  await knex.schema.alterTable("visitor_count", (t) => {
    t.datetime("recorded_at").nullable();
  });

  return knex.schema.createTable("scheduler_log", function (t) {
    t.increments("id").notNullable().primary();
    t.datetime("event_date").notNullable().defaultTo(knex.raw("GETDATE()"));
    t.string("event_target_time", 50).notNullable();
    t.string("event_target_date", 20).notNullable();
    t.string("event_description", 500).notNullable();
  });
};

exports.down = async function (knex: knex.Knex, Promise: any) {
  console.log("Dropped schedule table");

  await knex.schema.alterTable("visitor_centre", (t) => {
    t.dropColumn("reminders_at");
    t.dropColumn("reminders_when");
  });

  await knex.schema.alterTable("visitor_count", (t) => {
    t.dropColumn("recorded_at");
  });

  return knex.schema.dropTable("scheduler_log");
};
