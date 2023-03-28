import express, { Request, Response } from "express";
import { LoaderService } from "../services/loader-service";

export const loaderRouter = express.Router();
const loaderService = new LoaderService();

loaderRouter.post("/insertJsonStatSiteDailyCount", async (req: Request, res: Response) => {
  if (!req.files?.file) {
    res.status(500).json({ message: "No file found." });
  } else {
    try {
      const result = await loaderService.parseJsonFile(req.files?.file);

      console.log(`Atempting to load ${result.length} entries`);
      if (result.length > 0) {
        const loaded = await loaderService.insertParsedSiteDailyData(result);
        console.log(`Loaded ${loaded} entries`);
        res.status(200).json({ message: `Loaded ${loaded}/${result.length} entries` });
      } else {
        res.status(200).json({ message: `Nothing to load` });
      }
    } catch (err) {
      console.log("HERE", err);
      res.status(500).json({ message: err });
    }
  }
});
