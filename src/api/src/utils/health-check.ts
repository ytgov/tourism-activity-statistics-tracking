import { Request, Response } from "express";
import { MONGO_HOST } from "../config";

export async function doHealthCheck(req: Request, res: Response) {
  let appHealth = [];

  //database check
  let dbConnected = await req.store.isInitialized;
  appHealth.push({
    name: "Database",
    status: dbConnected,
    loading: false,
    helpNotes: `Check that the databases is running at: ${MONGO_HOST}`,
  });

  res.json({ appHealth });
}
