import * as knex from "knex";

exports.up = async function (knex: knex.Knex, Promise: any) {
  console.log("Created visitor_centre table");

  await knex.schema.createTable("visitor_centre", function (t) {
    t.increments("id").primary();
    t.string("name", 200).notNullable().unique();
    t.string("community", 200).notNullable();
    t.string("region", 200).notNullable();
    t.boolean("is_active").notNullable().defaultTo(true);
    t.integer("sort_order").notNullable().defaultTo(10);
  });

  let site_array = [
    {
      id: 1,
      name: "Whitehorse VIC",
      community: "Whitehorse",
      region: "Yukon",
      is_active: true,
    },
    {
      id: 2,
      name: "Watson Lake VIC",
      community: "Watson Lake",
      region: "Yukon",
      is_active: true,
    },
    {
      id: 3,
      name: "Haines Junction VIC",
      community: "Haines Junction",
      region: "Yukon",
      is_active: true,
    },
    {
      id: 4,
      name: "Beaver Creek VIC",
      community: "Beaver Creek",
      region: "Yukon",
      is_active: true,
    },
    {
      id: 5,
      name: "Old Crow VIC",
      community: "Old Crow",
      region: "Yukon",
      is_active: true,
    },
    {
      id: 6,
      name: "Carcross VIC",
      community: "Carcross",
      region: "Yukon",
      is_active: true,
    },
    {
      id: 7,
      name: "Airport",
      community: "Whitehorse",
      region: "Yukon",
      is_active: true,
    },
    {
      id: 8,
      name: "Dawson VIC",
      community: "Dawson",
      region: "Yukon",
      is_active: true,
    },
  ];

  let inserts = knex("visitor_centre").insert(site_array);
  let insertSQL = inserts.toSQL();

  await knex.raw(
    `SET IDENTITY_INSERT visitor_centre ON; ${insertSQL.sql}; SET IDENTITY_INSERT visitor_centre OFF `,
    insertSQL.bindings
  );
};

exports.down = function (knex: knex.Knex, Promise: any) {
  console.log("Dropped visitor_centre table");

  return knex.schema.dropTable("visitor_centre");
};
