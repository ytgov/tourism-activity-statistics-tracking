import * as knex from "knex";

// Not going to do this quite yet. I need to think about how to do this.
exports.up = async function (knex: knex.Knex, Promise: any) {
  console.log("Created views");

  await knex.raw(`CREATE VIEW visitor_daily_summary AS
    SELECT visitor_count.visitor_centre_id, visitor_count.visitor_origin_id, CONVERT(CHAR(10), visitor_count.date,126) AS [date], 
      CONVERT(INT, 0.5 * ((SUM(visitor_count.count) + 0) + ABS(SUM(visitor_count.count) - 0))) AS daily_count
    FROM visitor_count
    GROUP BY visitor_count.visitor_centre_id, visitor_count.visitor_origin_id, CONVERT(CHAR(10), visitor_count.date, 126)`);

  await knex.raw(`CREATE VIEW visitor_centre_origins AS
    SELECT c.id visitor_centre_id, c.name visitor_centre_name,
      c.community visitor_centre_community, c.region visitor_centre_region, c.is_active visitor_centre_active, 
      o.id origin_id, o.name origin_name, o.region origin_region, o.is_active origin_is_active
    FROM visitor_centre c, visitor_origin o`);

  await knex.raw(`CREATE VIEW visitor_centre_origins_daily AS
    SELECT o.*, [date], COALESCE(daily_count,0) AS daily_count
    FROM visitor_centre_origins o 
    LEFT OUTER JOIN visitor_daily_summary s ON o.visitor_centre_id = s.visitor_centre_id AND o.origin_id = s.visitor_origin_id`);
};

exports.down = async function (knex: knex.Knex, Promise: any) {
  console.log("Dropped views");
  await knex.schema.dropView("visitor_centre_origins_daily");
  await knex.schema.dropView("visitor_centre_origins");
  await knex.schema.dropView("visitor_daily_summary");
};
