import { sqldb } from "../data";
import { GenericService } from "./generic-service";

const SCHEMA = "dbo";
const SITE_TABLE = "sites";
const DAILY_COUNT_TABLE = "site_stats_daily";

export class LoaderService extends GenericService {
  async getAll(): Promise<any> {
    let data = { sites: [], dailyCounts: [] };
    data.sites = await sqldb.withSchema(SCHEMA).from(SITE_TABLE);
    data.dailyCounts = await sqldb.withSchema(SCHEMA).from(DAILY_COUNT_TABLE);
    return data;
  }

  parseJsonFile(file: any): String {
    const buffer = file.data as Buffer;
    const str = buffer.toString("utf8");
    const json = JSON.parse(str);
    return json;
  }

  async insertParsedSiteData(data: String): Promise<any> {
    const result = await sqldb.withSchema(SCHEMA).from(SITE_TABLE).insert(data);
    return result;
  }

  async insertParsedSiteDailyData(data: String): Promise<any> {
    const result = await sqldb.withSchema(SCHEMA).from(DAILY_COUNT_TABLE).insert(data);
    return result;
  }
}
