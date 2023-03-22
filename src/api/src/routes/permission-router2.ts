import express, { Request, Response } from "express";
import { param } from "express-validator";
import _ from "lodash";
import { RequiresData, ReturnValidationErrors } from "../middleware";
import { PermissionService2, VisitorCentreService } from "../services";

export const permissionRouter2 = express.Router();
permissionRouter2.use(RequiresData);

const permissionService = new PermissionService2();
const centreService = new VisitorCentreService();

permissionRouter2.get("/test", async (req: Request, res: Response) => {
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
