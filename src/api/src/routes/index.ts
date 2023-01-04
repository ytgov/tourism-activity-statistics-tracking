import * as knex from "knex";
import { DB_CONFIG } from "../config";

export * from "./user-router";
export * from "./config-router";
export * from "./permission-router";

export const sqldb = knex.knex(DB_CONFIG);
