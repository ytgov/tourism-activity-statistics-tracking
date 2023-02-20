import { User } from "../data/models";
import { sqldb } from "../data";

export class UserService {
  async create(user: User): Promise<any> {
    let existing = await sqldb("users").where({ email: user.email }).count("email as cnt");
    if (existing[0].cnt > 0) return undefined;
    return await sqldb("users").insert(cleanForCreate(user));
  }

  async update(email: string, item: any) {
    return sqldb("users").where({ email }).update(cleanForUpdate(item));
  }

  async getAll(): Promise<User[]> {
    return sqldb("users");
  }

  async getByEmail(email: string): Promise<User | undefined> {
    return sqldb("users").where({ email }).first();
  }

  async getBySub(sub: string): Promise<User | undefined> {
    return sqldb("users").where({ sub }).first();
  }

  async delete(email: string) {
    return sqldb("users").where({ email }).delete();
  }
}

function cleanForCreate(user: User): any {
  return {
    email: user.email,
    sub: user.sub,
    first_name: user.first_name,
    last_name: user.last_name,
    status: user.status,
    ynet_id: user.ynet_id,
    directory_id: user.directory_id,
    create_date: user.create_date,
    roles: user.roles,
    is_admin: user.is_admin,
  };
}

function cleanForUpdate(user: User): any {
  return {
    sub: user.sub,
    first_name: user.first_name,
    last_name: user.last_name,
    status: user.status,
    ynet_id: user.ynet_id,
    directory_id: user.directory_id,
    is_admin: user.is_admin,
  };
}
