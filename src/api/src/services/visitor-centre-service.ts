import { cloneDeep } from "lodash";
import moment from "moment";
import { VisitorCentre } from "src/data/models";

import { sqldb } from "../data";

export class VisitorCentreService {
  readonly ORIGINS = ["Yukon", "British Columbia", "Other Canada", "America", "International", "Unknown"];

  getAll(query?: any): Promise<VisitorCentre[]> {
    return sqldb("visitor_centre").where(query || {});
  }

  get(id: number): Promise<VisitorCentre | undefined> {
    return sqldb("visitor_centre").where({ id }).first();
  }
  async getWithStats(id: number, days: number): Promise<any> {
    let siteOrigins = await sqldb("visitor_centre_origins").where({ visitor_centre_id: id, origin_is_active: true });
    let returnValue = { id, name: siteOrigins[0].visitor_centre_name, days: new Array<any>() };

    let origins = siteOrigins.map((o) => {
      return { id: o.origin_id, name: o.origin_name };
    });

    let now = moment();
    days = 10;

    for (let i = 0; i < days; i++) {
      returnValue.days.push({
        date: now.format("YYYY-MM-DD"),
        origins: cloneDeep(origins),
      });

      now = now.add(-1, "days");
    }

    let originCounts = await sqldb("visitor_centre_origins_daily")
      .where({ visitor_centre_id: id, origin_is_active: true })
      .whereRaw(`([date] >= '${now.format("YYYY-MM-DD")}')`)
      .select(["origin_id", "date", "daily_count"]);

    for (let day of returnValue.days) {
      let dayMatches = originCounts.filter((o) => o.date == day.date);

      for (let origin of day.origins) {
        let originMatches = dayMatches.filter((o) => o.origin_id == origin.id);
        origin.daily_total = originMatches.reduce((acc, cur) => acc + cur.daily_count, 0);
        //origin.weeklyTotal = originMatches.reduce((acc, cur) => acc + cur.daily_count, 0);
        origin.delta = 0;
      }
    }

    return returnValue;
  }

  async updateAndGetStats(
    id: number,
    date: string,
    origins: any[],
    email: string,
    recorded_at: Date
  ): Promise<VisitorCentre | undefined> {
    let bumpDate = recorded_at;

    if (moment(recorded_at).format("YYYY-MM-DD") != date)
      bumpDate = moment.utc(date).set("hour", 11).set("minute", 59).toDate();

    for (let origin of origins) {
      if (origin.delta != 0 && origin.daily_total + origin.delta >= 0) {
        let bump = {
          visitor_centre_id: id,
          visitor_origin_id: origin.id,
          user_email: email,
          day: moment.utc(date).format("YYYY-MM-DD"),
          date: bumpDate,
          recorded_at,
          count: origin.delta,
        };

        await sqldb("visitor_count").insert(bump);
      }
    }

    return this.getWithStats(id, 10);
  }

  update(id: number, centre: VisitorCentre) {
    return sqldb("visitor_centre").where({ id }).update(cleanForUpdate(centre));
  }

  create(centre: VisitorCentre) {
    return sqldb("visitor_centre").insert(cleanForUpdate(centre));
  }

  delete(id: number) {
    sqldb("visitor_centre_season").where({ visitor_centre_id: id }).delete();
    return sqldb("visitor_centre").where({ id }).delete();
  }
}

function cleanForUpdate(i: any) {
  return {
    name: i.name,
    community: i.community,
    region: i.region,
    is_active: i.is_active,
    reminders_at: (i.reminders_at || []).join(","),
    reminders_when: i.reminders_when,
  };
}
