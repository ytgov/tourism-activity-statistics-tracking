import { Permissions, PermissionsInternal } from "../data/models";
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

  async getPermissionMap(email: string): Promise<any> {
    //return permissions, showing which came from role assignments

    let permissions = await this.db("direct_permissions")
      .select("create", "read", "update", "delete")
      .where("email", "=", email)
      .first();

    let roles = await this.db("user")
      .select("roles")
      .where("email", "=", email)
      .first();

    let rolePermissions = await this.db("roles")
      .select("role", "create", "read", "update", "delete")
      .whereIn("role", roles.roles.split(","));

    return { directPermissions: permissions, rolePermissions: rolePermissions };
  }

  async updateRoles(email: string, role: string): Promise<[]> {
    this.db.update("roles").from("users").where({ email }).first();
    return [];
  }

  async add(
    email: string,
    operation: string[] | string,
    scope: string[] | string
  ): Promise<any> {
    const insertObject = {} as PermissionsInternal;
    insertObject.email = email;

    let permissions = await this.db("direct_permissions")
      .select("create", "read", "update", "delete")
      .where("email", "=", email)
      .first();

    operation = this.inputClean(operation);
    scope = this.inputClean(scope);

    for (let op of operation) {
      if (
        op === "create" ||
        op === "read" ||
        op === "update" ||
        op === "delete"
      ) {
        permissions[op] && permissions[op].length > 0 ? permissions[op] : "[]";
        insertObject[op] = JSON.stringify(
          this.clearDuplicates([...scope, ...JSON.parse(permissions[op])])
        );
      }
    }
    return this.db("direct_permissions")
      .insert(insertObject)
      .onConflict("email")
      .merge();
  }

  async remove(
    email: string,
    operation: string[] | string,
    scope: string[] | string
  ): Promise<any> {
    const insertObject = {} as PermissionsInternal;
    insertObject.email = email;

    let permissions = await this.db("direct_permissions")
      .select("create", "read", "update", "delete")
      .where("email", "=", email)
      .first();

    operation = this.inputClean(operation);
    scope = this.inputClean(scope);

    for (let op of operation) {
      if (
        op === "create" ||
        op === "read" ||
        op === "update" ||
        op === "delete"
      ) {
        permissions[op] =
          permissions[op] && permissions[op].length > 0
            ? permissions[op]
            : "[]";
        insertObject[op] = JSON.stringify(
          this.clearDuplicates(
            [...JSON.parse(permissions[op])].filter((x) => !scope.includes(x))
          )
        );
      }
    }
    return this.db("direct_permissions")
      .insert(insertObject)
      .onConflict("email")
      .merge();
  }

  //Check if user has permission to perform all operations on scopes. Return true if all operations are allowed on all scopes.
  async check(
    email: string,
    operation: string[] | string,
    scope: string[] | string
  ): Promise<boolean> {
    operation = this.inputClean(operation);
    scope = this.inputClean(scope);

    let permissions = await this.aggregatePermissions(email);

    for (let op of operation) {
      if (
        op === "create" ||
        op === "read" ||
        op === "update" ||
        op === "delete"
      ) {
        if (permissions[op]) {
          if (!scope.every((x) => JSON.parse(permissions[op]).includes(x))) {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
    return true;
  }

  inputClean(value: string[] | string): string[] {
    value = typeof value === "string" ? [value] : value;
    return value;
  }

  clearDuplicates(array: string[]): string[] {
    return [...new Set(array)];
  }

  async aggregatePermissions(email: string) {
    let permissions = await this.db("direct_permissions")
      .select("create", "read", "update", "delete")
      .where("email", "=", email)
      .first();

    let roles = await this.db("user")
      .select("roles")
      .where("email", "=", email)
      .first();

    let rolePermissions = await this.db("roles")
      .select("create", "read", "update", "delete")
      .whereIn("role", roles.roles.split(","));

    let aggregatePermissions = permissions;

    for (let rolePermission of rolePermissions) {
      for (let op in rolePermission) {
        permissions[op] = JSON.stringify(
          this.clearDuplicates([
            ...JSON.parse(
              permissions[op] && permissions[op].length > 0
                ? permissions[op]
                : "[]"
            ),
            ...JSON.parse(
              rolePermission[op] && rolePermission[op].length > 0
                ? rolePermission[op]
                : "[]"
            ),
          ])
        );
      }
    }
    return aggregatePermissions;
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
