import { UserService } from "../services";

export class Storage {
  isInitialized: boolean = false;

  UserStore!: UserService;

  constructor() {
    this.UserStore = new UserService();
  }

  async ensureConnected(): Promise<string> {
    // if (this.isInitialized)
    return Promise.resolve("connected");
  }
}
