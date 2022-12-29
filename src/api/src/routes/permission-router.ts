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

permissionRouter.get("/check", async (req: Request, res: Response) => {
  await permissionService
    .check(req.body.email, req.body.operation, req.body.scope)
    .then((value) => {
      res.status(200).send(value);
    });
});

permissionRouter.get(
  "/getPermissions",
  async (req: Request, res: Response) => {}
);

permissionRouter.get("/addPermissions", async (req: Request, res: Response) => {
  await permissionService
    .add(req.body.email, req.body.operation, req.body.scope)
    .then((value) => {
      res.status(200).send(value);
    });
});

permissionRouter.get(
  "/removePermissions",
  async (req: Request, res: Response) => {
    await permissionService
      .remove(req.body.email, req.body.operation, req.body.scope)
      .then((value) => {
        res.status(200).send(value);
      });
  }
);

permissionRouter.get("/test", async (req: Request, res: Response) => {
  // await permissionService.add(
  //   "maxrparker@gmail.com",
  //   ["create", "update", "delete"],
  //   "Watson.lake"
  // );
  // await permissionService
  //   .getPermissionMapByOperation("maxrparker@gmail.com")
  //   .then((value) => {
  //     console.log("permission map", value);
  //   });
  // await permissionService
  //   .check("maxrparker@gmail.com", ["update", "create"], ["Watson.lake"])
  //   .then((value) => {
  //     console.log("access?", value);
  //   });
  // permissionService.remove("maxrparker@gmail.com", ["Watson.lake"], "update");
  // permissionService.getPermissionMapByScope("maxrparker@gmail.com");
  //console.log(permissionService.decomposeScope("watson lake.formb.otherstuff"));
});
