import _ from "lodash";
import { User } from "../data/models";
import { Knex } from "knex";

export class UserService {
  private db: Knex;

  constructor(db: Knex) {
    this.db = db;
  }

  async create(user: User): Promise<any> {
    let existing = await this.db("users")
      .where(user.email)
      .count("email as cnt");

    if (existing[0].cnt > 0) return undefined;

    return await this.db("users").insert(user);
  }

  async update(email: string, item: any) {
    return this.db("users").where({ email }).update(item);
  }

  async getAll() {
    return this.db("users");
  }

  async getByEmail(email: string): Promise<any | undefined> {
    return this.db("users").where({ email }).first();
  }

  async getById(id: string): Promise<any | undefined> {
    return this.db("users").where({ id }).first();
  }

  async delete(id: string) {
    return this.db("users").where({ id }).del();
  }

  // async getAll(query = {}): Promise<User[]> {
  //   return this.db.find<User>(query).toArray();
  // }

  //TODO
  async getBySub(sub: string): Promise<User | null> {
    return this.db("users").where({ sub }).first();
  }

  // async delete(id: string) {
  //   return this.db.deleteOne({ _id: new ObjectId(id) });
  // }
}
