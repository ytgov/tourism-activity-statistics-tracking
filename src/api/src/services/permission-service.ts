import { Permissions } from "../data/models";
import { Knex } from "knex";

export class PermissionService {
  private db: Knex;

  constructor(db: Knex) {
    this.db = db;
  }

  async getRoles(email: string): Promise<[]> {
    this.db.select("roles").from("users").where({ email }).first();
    return [];
  }

  async getPermissionMap(email: string): Promise<[]> {
    this.db.select("roles").from("users").where({ email }).first();
    return [];
  }

  async updateRoles(email: string, role: string): Promise<[]> {
    this.db.update("roles").from("users").where({ email }).first();
    return [];
  }

  async getPermissions(email: string): Promise<Permissions> {
    this.getRoles(email).then((roles) => {
      console.log(roles);
    });

    this.db
      .select("write", "read", "update", "delete")
      .from("permissions")
      .where({ email });
  }

  async add(
    email: string,
    operation: string[] | string,
    scope: string[] | string
  ): Promise<any> {
    let permissions = await this.db("direct_permissions")
      .select(operation)
      .where(email)
      .first();
    permissions = [...scope, ...permissions];
    return this.db
      .insert({ operation: permissions })
      .from("permissions")
      .where({ email })
      .onConflict("email")
      .merge();
  }

  async remove(
    operation: string[] | string,
    scope: string[] | string
  ): Promise<any> {}

  //single value only for now, no arrays
  async check(
    email: string,
    operation: string[] | string,
    scope: string[] | string
  ): Promise<boolean> {
    let permissions = await this.db("direct_permissions")
      .select(operation)
      .where(email)
      .first();

    return permissions.includes(scope);
  }

  //   async addOperationAlias(
  //     operationAlias: string,
  //     operation: string[]
  //   ): Promise<boolean> {}

  //   async removeOperationAlias(operation: string): Promise<boolean> {}

  //   async addScopeAlias(scopeAlias: string, scope: string[]): Promise<boolean> {}

  //   async removeScopeAlias(scopeAlias: string): Promise<boolean> {}

  //   async addScope(scope: string): Promise<boolean> {}

  //   async removeScope(scope: string): Promise<boolean> {}
}
