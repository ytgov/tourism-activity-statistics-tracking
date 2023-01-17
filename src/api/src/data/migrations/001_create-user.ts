import * as knex from "knex";

exports.up = function (knex: knex.Knex, Promise: any) {
  console.log("Created user table");
  return knex.schema.createTable("users", function (t) {
    t.string("email", 200).notNullable().primary();
    t.string("sub", 200).notNullable().unique();
    t.string("first_name", 100).notNullable();
    t.string("last_name", 100).notNullable();
    t.string("status", 20).notNullable();
    t.string("ynet_id", 50).nullable();
    t.string("directory_id", 100).nullable();
    t.dateTime("create_date").notNullable();
    t.string("roles", 1000).nullable();
  });
};

exports.down = function (knex: knex.Knex, Promise: any) {
  console.log("Dropped user table");
  return knex.schema.dropTable("users");
};
