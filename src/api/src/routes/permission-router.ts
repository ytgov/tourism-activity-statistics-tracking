import express, { Request, Response } from "express";
import { param } from "express-validator";
import _ from "lodash";
import { RequiresData, ReturnValidationErrors } from "../middleware";
import { PermissionService, VisitorCentreService } from "../services";

export const permissionRouter = express.Router();
permissionRouter.use(RequiresData);

const permissionService = new PermissionService();
const centreService = new VisitorCentreService();

permissionRouter.get("/", async (req: Request, res: Response) => {
  let centres = await centreService.getAll({ is_active: true });

  //let scopes = ["Users.Manage", "VisitorCentres.Manage"]
  let scopes = new Array<string>();
  let operations = ["Write", "Manage"];

  let names = centres.map((c) => c.name.replace(/\s/g, ""));

  for (let name of names) {
    for (let op of operations) {
      scopes.push(`VIC.${name}.${op}`);
    }
  }

  res.json({ data: { scopes } });
});

permissionRouter.get("/check", async (req: Request, res: Response) => {
  await permissionService.check(req.body.email, req.body.scope).then((value) => {
    res.status(200).send(value);
  });
});

permissionRouter.get("/getPermissions", async (req: Request, res: Response) => {
  await permissionService.aggregatePermissions(req.body.email).then((value) => {
    res.status(200).send(value);
  });
});

permissionRouter.get("/addPermissions", async (req: Request, res: Response) => {
  await permissionService.add(req.body.email, req.body.operation).then((value) => {
    res.status(200).send(value);
  });
});

permissionRouter.get("/removePermissions", async (req: Request, res: Response) => {
  await permissionService.remove(req.body.email, req.body.scope).then((value) => {
    res.status(200).send(value);
  });
});

permissionRouter.get("/test", async (req: Request, res: Response) => {
  // await permissionService.add("maxrparker@gmail.com", [
  //   "hi",
  //   "hey",
  //   "hello",
  //   "alpha",
  // ]);
  // await permissionService.remove("maxrparker@gmail.com", ["Watson.lake.formb"]);
  // await permissionService
  //   .getPermissionMapByOperation("maxrparker@gmail.com")
  //   .then((value) => {
  //     console.log("permission map", value);
  //   });
  // await permissionService
  //   .check("maxrparker@gmail.com", ["hello"])
  //   .then((value) => {
  //     console.log("access?", value);
  //   });
  // permissionService.getPermissionMapByScope("maxrparker@gmail.com");
  //console.log(permissionService.decomposeScope("watson lake.formb.otherstuff"));
});
