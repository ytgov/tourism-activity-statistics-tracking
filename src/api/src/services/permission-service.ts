import { sqldb } from "../data";
import { UserScope } from "../data/models";

const SCHEMA = "";
const TABLE = "permissions";

export class PermissionService {
  async setPermissions(email: string, scopes: string[]): Promise<any> {
    await sqldb(TABLE).where({ email }).delete();

    for (let scope of scopes) {
      let parts = scope.split(".");

      if (parts[0] == "VIC") {
        let p2 = parts[1].split("_");
        let operation = p2[0];
        let relevant_id = p2[1];

        await sqldb.withSchema(SCHEMA).from(TABLE).insert({
          name: scope,
          email,
          operation,
          relevant_entity: "visitor_centre",
          relevant_id,
          relevant_entity_type: "visitor_centre",
        });
      }
    }
  }

  async removePermission(
    email: string,
    params?: {
      name?: string;
      operation?: string;
      relevant_entity?: string;
      relevant_id?: string | number;
      relevant_entity_type?: string;
    }
  ): Promise<any> {
    return sqldb
      .withSchema(SCHEMA)
      .from(TABLE)
      .where({ email, ...params })
      .del();
  }

  async removePermissionById(id: string | number): Promise<any> {
    return sqldb.withSchema(SCHEMA).from(TABLE).where({ id }).del();
  }

  async getUserPermissions(
    email: string,
    params?: {
      name?: string;
      operation?: string;
      relevant_entity?: string;
      relevant_id?: string | number;
      relevant_entity_type?: string;
    }
  ): Promise<UserScope[]> {
    return sqldb<UserScope>(TABLE).withSchema(SCHEMA).where({ email });
  }

  async checkPermission(
    user: string,
    params?: {
      name?: string;
      operation?: string;
      relevant_entity?: string;
      relevant_id?: string | number;
      relevant_entity_type?: string;
    }
  ): Promise<boolean> {
    const permissions = await this.getUserPermissions(user, params);
    return permissions.length > 0;
  }
}
