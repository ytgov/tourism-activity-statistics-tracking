// SITE ID NUMBER No (null)
// SITE_DESC VARCHAR2 (255 BYTE) No (null)
// IS_ACTIVE_FLG VARCHAR2 (3 BYTE) No "Yes'
// SORT ORDER NUMBER Yes (null)
// REC_CREAIE_DATE DATE Yes (null)
// REC_CREATE_USER NUMBER Yes (null)
// REC_LAST_MOD_DATE DATE Yes (null)
// REC LAST MOD USER NUMBER Yes (null)

import * as knex from "knex";

exports.up = async function (knex: knex.Knex, Promise: any) {
  console.log("Created sites table");

  await knex.schema.createTable("sites", function (t) {
    t.increments("site_id").primary();
    t.string("site_desc", 255).notNullable();
    t.boolean("is_active_flg").notNullable().defaultTo(true);
    t.integer("sort_order").nullable();
    t.dateTime("rec_create_date").nullable();
    t.integer("rec_create_user").nullable();
    t.dateTime("rec_last_mod_date").nullable();
    t.integer("rec_last_mod_user").nullable();
  });
};

exports.down = function (knex: knex.Knex, Promise: any) {
  console.log("Dropped sites table");
  return knex.schema.dropTable("sites");
};
