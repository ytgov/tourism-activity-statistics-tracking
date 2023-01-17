import { NextFunction, Request, Response } from "express";
import { PermissionService } from "../services";

import { sqldb } from "../data";

export async function hasAccess(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const permissionService = new PermissionService(sqldb);
  const { email, scope } = req.body;

  const hasAccess = await permissionService.check(email, scope);

  if (hasAccess) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
}
