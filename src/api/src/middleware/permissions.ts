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

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const hasAccess = req.user && req.user.status == "Active" && req.user.is_admin;

  if (hasAccess) {
    next();
  } else {
    return res.status(401).send("Unauthorized");
  }
}
