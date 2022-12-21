import express, { Request, Response } from "express";
import { param } from "express-validator";
import { RequiresData, ReturnValidationErrors } from "../middleware";
import { PermissionService } from "../services";
import { DB_CONFIG } from "../config";
import knex from "knex";

import _ from "lodash";

export const permissionRouter = express.Router();
permissionRouter.use(RequiresData);

const db = knex(DB_CONFIG);
const permissionService = new PermissionService(db);

permissionRouter.get("/check", async (req: Request, res: Response) => {});

permissionRouter.get(
  "/getPermissions",
  async (req: Request, res: Response) => {}
);

permissionRouter.get(
  "/addPermissions",
  async (req: Request, res: Response) => {}
);

permissionRouter.get(
  "/removePermissions",
  async (req: Request, res: Response) => {}
);
