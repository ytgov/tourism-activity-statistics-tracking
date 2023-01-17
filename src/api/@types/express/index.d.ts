import { Express } from "express-serve-static-core";

interface Store {
  UserStore: UserService;
  isInitialized: boolean;
}

declare module "express-serve-static-core" {
  interface Request {
    store: Store;
    user?: any;
  }
}

/* 
namespace Express {
  export interface Request {
    user?: any;
    //store?: Storage;
  }
}
 */
