import { KioskData } from "src/data/models";

import { sqldb } from "../data";

export class KioskDataService {
  getAll(query?: any): Promise<KioskData[]> {
    return sqldb("kiosk_data").where(query || {});
  }

  get(id: number): Promise<KioskData | undefined> {
    return sqldb("kiosk_data").where({ id }).first();
  }

  update(id: number, centre: KioskData) {
    return sqldb("kiosk_data").where({ id }).update(cleanForUpdate(centre));
  }

  create(centre: KioskData) {
    return sqldb("kiosk_data").insert(cleanForUpdate(centre));
  }

  delete(id: number) {
    return sqldb("kiosk_data").where({ id }).delete();
  }
}

function cleanForUpdate(i: any) {
  return {
    kiosk_name: i.kiosk_name,
    start_date: i.start_date,
    end_date: i.end_date,
    playout_item: i.playout_item,
    playout_count: i.playout_count,
    playout_seconds: i.playout_seconds,
  };
}
