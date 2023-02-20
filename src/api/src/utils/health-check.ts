import { Request, Response } from "express";

export async function doHealthCheck(req: Request, res: Response) {
  let appHealth = [];

  //database check
  //let dbConnected = await req.store.isInitialized;
  appHealth.push({
    name: "Database",
    status: "Unknown",
    loading: false,
    helpNotes: `Check that the databases is running at:`,
  });

  res.json({ appHealth });
}
