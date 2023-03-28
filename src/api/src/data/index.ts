import * as knex from "knex";
import { DB_CONFIG } from "../config";

export * from "./migrator";

export const sqldb = knex.knex(DB_CONFIG);
