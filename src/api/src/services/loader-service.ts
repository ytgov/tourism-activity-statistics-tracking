import moment from "moment";
import { sqldb } from "../data";

const SCHEMA = "";
const SITE_TABLE = "vistior_centre";
const DAILY_COUNT_TABLE = "visitor_count";

export class LoaderService {
  async getAll(): Promise<any> {
    let data = { sites: [], dailyCounts: [] };
    data.sites = await sqldb.withSchema(SCHEMA).from(SITE_TABLE);
    data.dailyCounts = await sqldb.withSchema(SCHEMA).from(DAILY_COUNT_TABLE);
    return data;
  }

  async parseJsonFile(file: any): Promise<any[]> {
    const buffer = file.data as Buffer;
    const str = buffer.toString("utf8");
    const json = JSON.parse(str);
    return json.items;
  }

  async insertParsedSiteDailyData(data: any[]): Promise<any> {
    for (let i = 0; i < data.length; i++) {
      try {
        let date = moment(data[i].count_date, "DD-MMM-YY").utcOffset(0, true);
        let rowTotal = parseInt(data[i].total_count);

        if (data[i].from_yukon) {
          let insert = {
            visitor_centre_id: data[i].site_id,
            visitor_origin_id: 1,
            user_email: "Data Loader",
            day: date.format("YYYY-MM-DD"),
            date: date.toDate(),
            count: data[i].from_yukon,
          };
          await sqldb.withSchema(SCHEMA).from(DAILY_COUNT_TABLE).insert(insert);
          rowTotal -= insert.count;
        }

        if (data[i].from_bc) {
          let insert = {
            visitor_centre_id: data[i].site_id,
            visitor_origin_id: 2,
            user_email: "Data Loader",
            day: date.format("YYYY-MM-DD"),
            date: date.toDate(),
            count: data[i].from_bc,
          };
          await sqldb.withSchema(SCHEMA).from(DAILY_COUNT_TABLE).insert(insert);
          rowTotal -= insert.count;
        }

        if (data[i].from_ca) {
          let insert = {
            visitor_centre_id: data[i].site_id,
            visitor_origin_id: 3,
            user_email: "Data Loader",
            day: date.format("YYYY-MM-DD"),
            date: date.toDate(),
            count: data[i].from_ca,
          };
          await sqldb.withSchema(SCHEMA).from(DAILY_COUNT_TABLE).insert(insert);
          rowTotal -= insert.count;
        }

        if (data[i].from_us) {
          let insert = {
            visitor_centre_id: data[i].site_id,
            visitor_origin_id: 4,
            user_email: "Data Loader",
            day: date.format("YYYY-MM-DD"),
            date: date.toDate(),
            count: data[i].from_us,
          };
          await sqldb.withSchema(SCHEMA).from(DAILY_COUNT_TABLE).insert(insert);
          rowTotal -= insert.count;
        }

        if (data[i].from_intl) {
          let insert = {
            visitor_centre_id: data[i].site_id,
            visitor_origin_id: 5,
            user_email: "Data Loader",
            day: date.format("YYYY-MM-DD"),
            date: date.toDate(),
            count: data[i].from_intl,
          };
          await sqldb.withSchema(SCHEMA).from(DAILY_COUNT_TABLE).insert(insert);
          rowTotal -= insert.count;
        }

        if (rowTotal > 0) {
          let insert = {
            visitor_centre_id: data[i].site_id,
            visitor_origin_id: 6,
            user_email: "Data Loader",
            day: date.format("YYYY-MM-DD"),
            date: date.toDate(),
            count: rowTotal,
          };
          await sqldb.withSchema(SCHEMA).from(DAILY_COUNT_TABLE).insert(insert);
        }
      } catch (err) {
        console.log(err);
      }
    }
    return data.length;
  }
}
