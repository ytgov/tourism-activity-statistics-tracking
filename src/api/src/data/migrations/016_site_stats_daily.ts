// COLUMN NAME } DATA_TYPE § NULLABLE DATA_DEFAULT
// SITE_DAILY_COUNT_ID NUMBER No (null)
// SITE ID NUMBER No (null)
// COUNT DATE DATE No (null)
// TOTAL_COUNT NUMBER No (null)
// IS_NON_IOUR_FIG VARCHARZ (3 BYTE) No 'No'
// IS TOUR FLG No 'No'
// REC_CREATE_DATE Yes (null)
// VARCHAR2(8 BYTE)
// REC CREATE USER NUMBER Yes (null)
// REC LAST MOD DATE DATE Yes (null)
// REC_LASI_MOD_USER NUMBER Yes (null)
// FROM YUKON NUMBER Yes (null)
// FROM_BC NUMBER Yes (null)
// FROM CA NUMBER Yes (null)
// FROM US NUMBER Yes (null)
// FROM INTL NUMBER Yes (null)
// FROM UNKNOWN NUMBER Yes (null)
// INTL_ORIGIN VARCHAR2 (200 BYTE) Yes (null)

import * as knex from "knex";

exports.up = async function (knex: knex.Knex, Promise: any) {
  console.log("Created site_stats_daily table");

  await knex.schema.createTable("site_stats_daily", function (t) {
    t.increments("site_daily_count_id").primary();
    t.integer("site_id").notNullable();
    t.dateTime("count_date").notNullable();
    t.float("total_count").notNullable();
    t.boolean("is_non_tour_flg").notNullable().defaultTo(false);
    t.boolean("is_tour_flg").notNullable().defaultTo(false);
    t.dateTime("rec_create_date").nullable();
    t.integer("rec_create_user").nullable();
    t.dateTime("rec_last_mod_date").nullable();
    t.integer("rec_last_mod_user").nullable();
    t.integer("from_yukon").nullable();
    t.integer("from_bc").nullable();
    t.integer("from_ca").nullable();
    t.integer("from_us").nullable();
    t.integer("from_intl").nullable();
    t.integer("from_unknown").nullable();
    t.string("intl_origin", 200).nullable();
  });
};

exports.down = function (knex: knex.Knex, Promise: any) {
  console.log("Dropped site_stats_daily table");
  return knex.schema.dropTable("site_stats_daily");
};
