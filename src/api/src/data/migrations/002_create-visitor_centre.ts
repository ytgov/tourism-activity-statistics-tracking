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

  SET IDENTITY_INSERT ON

  let site_array = [
    {"site_id":1,"site_desc":"Whitehorse VIC","is_active_flg":"Yes","rec_create_date":"16-MAY-13","rec_create_user":0}
    ,{"site_id":3,"site_desc":"Haines Junction VIC","is_active_flg":"Yes","rec_create_date":"16-MAY-13","rec_create_user":0}
    ,{"site_id":4,"site_desc":"Beaver Creek VIC","is_active_flg":"Yes","rec_create_date":"16-MAY-13","rec_create_user":0}
    ,{"site_id":5,"site_desc":"Old Crow VIC","is_active_flg":"Yes","rec_create_date":"16-MAY-13","rec_create_user":0}
    ,{"site_id":6,"site_desc":"Carcross VIC","is_active_flg":"Yes","rec_create_date":"16-MAY-13","rec_create_user":0}
    ,{"site_id":7,"site_desc":"Airport","is_active_flg":"Yes","rec_create_date":"16-MAY-13","rec_create_user":0}
    ,{"site_id":8,"site_desc":"Dawson VIC","is_active_flg":"Yes","rec_create_date":"16-MAY-13","rec_create_user":0}
    ,{"site_id":2,"site_desc":"Watson Lake VIC","is_active_flg":"Yes","rec_create_date":"16-MAY-13","rec_create_user":0}
    ]

  return knex("visitor_center").insert(site_array)
};

exports.down = function (knex: knex.Knex, Promise: any) {
  console.log("Dropped visitor_centre table");

  return knex.schema.dropTable("visitor_centre");
};
