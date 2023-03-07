import * as knex from "knex";

exports.up = async function (knex: knex.Knex, Promise: any) {
  console.log("Created visitor_origin table");

  await knex.schema.createTable("visitor_origin", function (t) {
    t.increments("id").primary();
    t.string("name", 200).notNullable();
    t.string("region", 200).notNullable();
    t.boolean("is_active").notNullable().defaultTo(true);
  });

  //seed some data in.
  
  /*
  yukon
  bc
  canada
  us
  intl
  unknown
*/

};

exports.down = function (knex: knex.Knex, Promise: any) {
  console.log("Dropped visitor_origin table");

  return knex.schema.dropTable("visitor_origin");
};
