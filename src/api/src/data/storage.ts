import { MONGO_URL, MONGO_DB } from "../config";
import { GenericService, UserService } from "../services";

export class Storage {
  isInitialized: boolean = false;

  Users!: UserService;

  constructor() {}

  async ensureConnected(): Promise<string> {
    // if (this.isInitialized)
    return Promise.resolve("connected");
  }
}
