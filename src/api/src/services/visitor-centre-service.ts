import { VisitorCentre } from "src/data/models";

import { sqldb } from "../data";

export class VisitorCentreService {
  getAll(): Promise<VisitorCentre> {
    return sqldb("visitor_centre");
  }

  get(id: number): Promise<VisitorCentre | undefined> {
    return sqldb("visitor_centre").where({ id }).first();
  }

  update(id: number, centre: VisitorCentre) {
    return sqldb("visitor_centre").where({ id }).update(cleanForUpdate(centre));
  }

  create(centre: VisitorCentre) {
    return sqldb("visitor_centre").insert(cleanForUpdate(centre));
  }

  delete(id: number) {
    sqldb("visitor_centre_season").where({ visitor_center_id: id }).delete();
    return sqldb("visitor_centre").where({ id }).delete();
  }
}

function cleanForUpdate(i: any) {
  return {
    name: i.name,
    community: i.community,
    region: i.region,
    is_active: i.is_active,
  };
}
