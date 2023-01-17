import { User } from "../data/models";
import { Knex } from "knex";

export class UserService {
  private db: Knex;

  constructor(db: Knex) {
    this.db = db;
  }

  async create(user: User): Promise<any> {
    let existing = await this.db("users").where({ email: user.email }).count("email as cnt");

    console.log("EXISST", existing);

    if (existing[0].cnt > 0) return undefined;

    return await this.db("users").insert(user);
  }

  async update(email: string, item: any) {
    return this.db("users").where({ email }).update(item);
  }

  async getAll() {
    return this.db("users");
  }

  async getByEmail(email: string): Promise<User | undefined> {
    return this.db("users").where({ email }).first();
  }

  async getBySub(sub: string): Promise<User | undefined> {
    return this.db("users").where({ sub }).first();
  }

  async delete(email: string) {
    return this.db("users").where({ email }).delete();
  }
}
