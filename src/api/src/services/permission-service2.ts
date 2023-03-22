import { sqldb } from "../data";
import { GenericService } from "./generic-service";

const SCHEMA = "";
const TABLE = "permissions";

export class PermissionService2 {
  async addPermission(
    user: string,
    name: string,
    operation: string,
    entity: string,
    id: string,
    entityType: string
  ): Promise<any> {
    return sqldb.withSchema(SCHEMA).from(TABLE).insert({
      name: name,
      user: user,
      operation: operation,
      relevant_entity: entity,
      relevant_id: id,
      relevant_entity_type: entityType
    });
  }

  async removePermission(id: string | number): Promise<any> {
    return sqldb.withSchema(SCHEMA).from(TABLE).where({ id }).del();
  }

  async getUserPermissions(
    user: string,
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
      .where({ user, ...params });
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
