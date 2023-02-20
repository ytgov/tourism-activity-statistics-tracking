import { Knex } from "knex";
import { sqldb } from "../data";

export class PermissionService {

  async add(email: string, scope: string[] | string): Promise<any> {
    let permissions = await sqldb("direct_permissions").select("*").where({ email }).first();

    permissions = permissions.scopes ? JSON.parse(permissions.scopes) : [];

    scope = this.inputClean(scope);

    let insertPermissions = this.clearDuplicates([...scope, ...permissions]);

    return sqldb("direct_permissions")
      .insert({
        email: email,
        scopes: this.arrayPermsToStringPerms(insertPermissions.sort(this.sortCaseInsensitive)),
      })
      .onConflict("email")
      .merge();
  }

  async remove(email: string, scope: string[] | string): Promise<any> {
    let permissions = await sqldb("direct_permissions").select("*").where({ email }).first();

    permissions = permissions.scopes ? JSON.parse(permissions.scopes) : [];

    scope = this.inputClean(scope);

    let insertPermissions = permissions.filter((perm: any) => !scope.includes(perm));

    return sqldb("direct_permissions")
      .insert({
        email: email,
        scopes: this.arrayPermsToStringPerms(insertPermissions),
      })
      .onConflict("email")
      .merge();
  }

  async check(email: string, scope: string[] | string): Promise<boolean> {
    let permissions = await sqldb("direct_permissions").select("*").where({ email }).first();

    permissions = await this.aggregatePermissions(email);

    let scopeClean = this.inputClean(scope);

    let hasPermission = false;

    for (let i = 0; i < scopeClean.length; i++) {
      if (permissions.includes(scopeClean[i])) {
        hasPermission = true;
      } else {
        hasPermission = false;
        break;
      }
    }
    return hasPermission;
  }

  async createRole(role: string, scope: string[] | string): Promise<any> {
    let roleRow = await sqldb("roles").select("*").where({ role }).first();

    if (roleRow) return undefined;

    scope = this.inputClean(scope);

    return sqldb("roles").insert({
      role: role,
      scopes: this.arrayPermsToStringPerms(scope.sort(this.sortCaseInsensitive)),
    });
  }

  async deleteRole(role: string): Promise<any> {
    return sqldb("roles").where({ role }).del();
  }

  async addRoleScope(role: string, scope: string[] | string): Promise<any> {
    let roleRow = await sqldb("roles").select("*").where({ role }).first();

    roleRow = roleRow.scopes ? JSON.parse(roleRow.scopes) : [];

    scope = this.inputClean(scope);

    let insertPermissions = this.clearDuplicates([...scope, ...roleRow]);

    return sqldb("roles")
      .insert({
        role: role,
        scopes: this.arrayPermsToStringPerms(insertPermissions.sort(this.sortCaseInsensitive)),
      })
      .onConflict("role")
      .merge();
  }

  async removeRoleScope(role: string, scope: string[] | string): Promise<any> {
    let roleRow = await sqldb("roles").select("*").where({ role }).first();

    roleRow = roleRow.scopes ? JSON.parse(roleRow.scopes) : [];

    scope = this.inputClean(scope);

    let insertPermissions = roleRow.filter((perm: any) => !scope.includes(perm));

    return sqldb("roles")
      .insert({
        role: role,
        scopes: this.arrayPermsToStringPerms(insertPermissions),
      })
      .onConflict("role")
      .merge();
  }

  async addUserRole(email: string, role: string): Promise<any> {
    let roles = await sqldb("users").select("roles").where({ email }).first();

    roles = roles.roles ? JSON.parse(roles.roles) : [];

    roles.push(role);

    roles = this.clearDuplicates(roles).sort(this.sortCaseInsensitive);

    return sqldb("users")
      .where({ email })
      .update({ roles: JSON.stringify(roles) });
  }

  async removeUserRole(email: string, role: string): Promise<any> {
    let roles = await sqldb("users").select("roles").where({ email }).first();

    roles = roles.roles ? JSON.parse(roles.roles) : [];

    roles = roles.filter((r: any) => r !== role);

    return sqldb("users")
      .where({ email })
      .update({ roles: JSON.stringify(roles) });
  }

  async getRoles(email: string): Promise<any> {
    let roles = await sqldb("users").select("roles").where({ email }).first();

    roles = roles.roles ? JSON.parse(roles.roles) : [];

    return roles;
  }

  inputClean(value: string[] | string): string[] {
    value = typeof value === "string" ? [value] : value;
    return value;
  }

  clearDuplicates(array: string[]): string[] {
    return [...new Set(array)];
  }

  async aggregatePermissions(email: string) {
    let permissions = await sqldb("direct_permissions").select("*").where({ email }).first();

    if (!permissions) return [];

    permissions = permissions.scopes ? JSON.parse(permissions.scopes) : [];

    let roles = await sqldb("users").select("roles").where({ email }).first();

    roles = roles.roles ? JSON.parse(roles.roles) : [];

    let rolePermissions = await sqldb("roles").select("scopes").whereIn("role", roles);

    rolePermissions = rolePermissions.map((role: any) => {
      return role.scopes ? JSON.parse(role.scopes) : [];
    });

    let aggregatePermissions = [...permissions, ...rolePermissions.flat()];
    aggregatePermissions = this.clearDuplicates(aggregatePermissions).sort(this.sortCaseInsensitive);

    return aggregatePermissions;
  }

  arrayPermsToStringPerms(permissions: Array<string>): string {
    let stringPermissions = permissions && permissions.length > 0 ? JSON.stringify(permissions) : "[]";

    return stringPermissions;
  }

  sortCaseInsensitive(a: string, b: string) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  }

  decomposeScope(scope: string): string[] {
    let scopeArray = scope.split(".");
    let decomposedScope = [];
    for (let i = 0; i < scopeArray.length; i++) {
      decomposedScope.push(scopeArray.slice(0, i + 1).join("."));
    }
    return decomposedScope;
  }

  //   async addScopeAlias(scopeAlias: string, scope: string[]): Promise<boolean> {}

  //   async removeScopeAlias(scopeAlias: string): Promise<boolean> {}

  //   async addScope(scope: string): Promise<boolean> {}

  //   async removeScope(scope: string): Promise<boolean> {}
}
