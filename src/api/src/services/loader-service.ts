import { sqldb } from "../data";
import { GenericService } from "./generic-service";

const SCHEMA = "";
const SITE_TABLE = "sites";
const DAILY_COUNT_TABLE = "site_stats_daily";

export class LoaderService extends GenericService {
  async getAll(): Promise<any> {
    let data = { sites: [], dailyCounts: [] };
    data.sites = await sqldb.withSchema(SCHEMA).from(SITE_TABLE);
    data.dailyCounts = await sqldb.withSchema(SCHEMA).from(DAILY_COUNT_TABLE);
    return data;
  }

  async parseJsonFile(file: any): Promise<String> {
    const buffer = file.data as Buffer;
    const str = buffer.toString("utf8");
    const json = JSON.parse(str);
    return json.items;
  }

  async insertParsedSiteData(data: {}): Promise<any> {
    console.log(data);
    const result = await sqldb.withSchema(SCHEMA).from(SITE_TABLE).insert(data);
    return result;
  }

  async insertParsedSiteDailyData(data: any): Promise<any> {
    for (let i = 0; i < data.length; i++) {
      console.log(data[i]);
      try {
        await sqldb.withSchema(SCHEMA).from(DAILY_COUNT_TABLE).insert(data[i]);
      } catch (err) {
        console.log(err);
      }
    }
    return data.length;
  }
}
