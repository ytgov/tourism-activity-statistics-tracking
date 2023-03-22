import express, { Request, Response } from "express";
import { param } from "express-validator";
import _ from "lodash";
import { RequiresData, ReturnValidationErrors } from "../middleware";
import { PermissionService } from "../services";

export const permissionRouter = express.Router();
permissionRouter.use(RequiresData);

const permissionService = new PermissionService();

permissionRouter.get("/:email", async (req: Request, res: Response) => {
  await permissionService.getUserPermissions(req.params.email, req.body.data).then(value => {
    res.status(200).send(value);
  });
});

permissionRouter.post("/add", async (req: Request, res: Response) => {
  await permissionService.addPermission(
    req.body.email,
    req.body.scope,
    req.body.operation,
    req.body.relevant_entity_type,
    req.body.relevant_id,
    req.body.relevant_name
  );

  res.status(200).json({ message: "OK" });
});

permissionRouter.post("/remove", async (req: Request, res: Response) => {
  await permissionService.removePermission(req.params.id);

  res.status(200).json({ message: "OK" });
});

permissionRouter.get("/check", async (req: Request, res: Response) => {
  await permissionService.checkPermission(req.body.email, req.body.data).then(value => {
    res.status(200).send(value);
  });
});

permissionRouter.get("/test", async (req: Request, res: Response) => {
  //   await permissionService.addPermission(
  //     "maxrparker@gmail.com",
  //     "VIC Whitehorse Manage",
  //     "write",
  //     "visitor-centre",
  //     "3",
  //     "Table"
  //   );

  console.log(await permissionService.getUserPermissions("maxrparker@gmail.com"));

  //   console.log("Relevant ID:", await permissionService.getUserPermissions("maxrparker@gmail.com", { relevant_id: "2" }));
  console.log(
    "Relevant entity type:",
    await permissionService.getUserPermissions("maxrparker@gmail.com", { relevant_entity_type: "Table" })
  );

  res.status(200).json({ message: "OK" });
});
