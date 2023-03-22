import * as knex from "knex";

exports.up = async function (knex: knex.Knex, Promise: any) {
  console.log("Created visitor_origin table");

  await knex.schema.createTable("visitor_origin", function (t) {
    t.increments("id").primary();
    t.string("name", 200).notNullable();
    t.string("region", 200).notNullable();
    t.boolean("is_active").notNullable().defaultTo(true);
  });

  await knex("visitor_origin").insert({ name: "Yukon", region: "Canada" });
  await knex("visitor_origin").insert({ name: "British Columbia", region: "Canada" });
  await knex("visitor_origin").insert({ name: "Other Canda", region: "Canada" });
  await knex("visitor_origin").insert({ name: "American", region: "North America" });
  await knex("visitor_origin").insert({ name: "International", region: "Global" });
  await knex("visitor_origin").insert({ name: "Unknown", region: "Unknown" });
};

exports.down = function (knex: knex.Knex, Promise: any) {
  console.log("Dropped visitor_origin table");

  return knex.schema.dropTable("visitor_origin");
};
