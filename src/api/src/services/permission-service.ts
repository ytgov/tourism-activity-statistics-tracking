import { PermissionsString, PermissionsArray } from "../data/models";
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

  async getPermissionMapByOperation(email: string): Promise<any> {
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

  //TODO
  async getPermissionMapByScope(email: string) {
    let permissions = this.stringPermsToArrayPerms(
      await this.db("direct_permissions")
        .select("create", "read", "update", "delete")
        .where("email", "=", email)
        .first()
    );

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
    const insertObject = {} as PermissionsArray;
    insertObject.email = email;

    let permissions = this.stringPermsToArrayPerms(
      await this.db("direct_permissions")
        .select("create", "read", "update", "delete")
        .where("email", "=", email)
        .first()
    );

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
        insertObject[op] = this.clearDuplicates([...scope, ...permissions[op]]);
      }
    }
    return this.db("direct_permissions")
      .insert(this.arrayPermsToStringPerms(insertObject))
      .onConflict("email")
      .merge();
  }

  async remove(
    email: string,
    operation: string[] | string,
    scope: string[] | string
  ): Promise<any> {
    const insertObject = {} as PermissionsArray;
    insertObject.email = email;

    let permissions = this.stringPermsToArrayPerms(
      await this.db("direct_permissions")
        .select("create", "read", "update", "delete")
        .where("email", "=", email)
        .first()
    );

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
        insertObject[op] = this.clearDuplicates(
          [...permissions[op]].filter((x) => !scope.includes(x))
        );
      }
    }

    return this.db("direct_permissions")
      .insert(this.arrayPermsToStringPerms(insertObject))
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
    let permissions = this.stringPermsToArrayPerms(
      await this.db("direct_permissions")
        .select("create", "read", "update", "delete")
        .where("email", "=", email)
        .first()
    );

    let roles = await this.db("user")
      .select("roles")
      .where("email", "=", email)
      .first();

    let rolePermissions = await this.db("roles")
      .select("create", "read", "update", "delete")
      .whereIn("role", roles.roles.split(","));

    let aggregatePermissions = permissions;

    for (let role of rolePermissions) {
      role = this.stringPermsToArrayPerms(role);
      for (let op of Object.keys(role)) {
        if (aggregatePermissions[op]) {
          aggregatePermissions[op] = this.clearDuplicates([
            ...aggregatePermissions[op],
            ...role[op],
          ]);
        } else {
          aggregatePermissions[op] = role[op];
        }
      }
    }
    return this.arrayPermsToStringPerms(aggregatePermissions);
  }

  stringPermsToArrayPerms(permissions: PermissionsString): PermissionsArray {
    let arrayPermissions = {} as PermissionsArray;
    arrayPermissions.email = permissions.email;

    arrayPermissions.create = JSON.parse(
      permissions.create && permissions.create.length > 0
        ? permissions.create
        : "[]"
    );

    arrayPermissions.read = JSON.parse(
      permissions.read && permissions.read.length > 0 ? permissions.read : "[]"
    );

    arrayPermissions.update = JSON.parse(
      permissions.update && permissions.update.length > 0
        ? permissions.update
        : "[]"
    );

    arrayPermissions.delete = JSON.parse(
      permissions.delete && permissions.delete.length > 0
        ? permissions.delete
        : "[]"
    );
    return arrayPermissions;
  }

  arrayPermsToStringPerms(permissions: PermissionsArray): PermissionsString {
    let stringPermissions = {} as PermissionsString;
    stringPermissions.email = permissions.email;

    permissions.create
      ? (stringPermissions.create = JSON.stringify(permissions.create))
      : delete stringPermissions.create;
    permissions.read
      ? (stringPermissions.read = JSON.stringify(permissions.read))
      : delete stringPermissions.read;
    permissions.update
      ? (stringPermissions.update = JSON.stringify(permissions.update))
      : delete stringPermissions.update;
    permissions.delete
      ? (stringPermissions.delete = JSON.stringify(permissions.delete))
      : delete stringPermissions.delete;

    return stringPermissions;
  }

  decomposeScope(scope: string): string[] {
    let scopeArray = scope.split(".");
    let decomposedScope = [];
    for (let i = 0; i < scopeArray.length; i++) {
      decomposedScope.push(scopeArray.slice(0, i + 1).join("."));
    }
    return decomposedScope;
  }

  arrayFlip(array: Array<string>): Array<string> {
    return Object.keys(array).reduce((ret: any, key: any) => {
      ret[array[key]] = key;
      return ret;
    }, {});
  }

  flipPermissions(permissions: PermissionsArray): Object {
    let operations = ["create", "read", "update", "delete"];
    let returnObject = {} as Record<string, string[]>;

    for (let op of operations) {
      permissions[op] && permissions[op].length > 0 ? permissions[op] : "[]";
      // permissions[op] = this.arrayFlip(permissions[op]);
      returnObject[permissions[op]] = ["1", "2"];
    }

    return permissions;
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
