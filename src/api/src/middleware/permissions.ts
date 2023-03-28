import { NextFunction, Request, Response } from "express";
import { PermissionService } from "../services";

export async function hasAccess(req: Request, res: Response, next: NextFunction) {
  const permissionService = new PermissionService();
  const { email, scope } = req.body;

  const hasAccess = true; // await permissionService.check(email, scope);

  if (hasAccess) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
}
