import express, { Request, Response } from "express";
import { LoaderService } from "../services/loader-service";

export const loaderRouter = express.Router();
const loaderService = new LoaderService();

loaderRouter.post("/readJson", async (req: Request, res: Response) => {
  if (!req.files?.file) {
    res.status(500).json({ message: "No file found." });
  } else {
    try {
      const result = loaderService.parseJsonFile(req.files?.file);
      res.status(200).json({ data: result });
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
});

// loaderRouter.post("/insertJson", async (req: Request, res: Response) => {
//   if (!req.files?.file) {
//     res.status(500).json({ message: "No file found." });
//   } else {
//     try {
//       const result = loaderService.parseJsonFile(req.files?.file);

//       if (result.length > 0) {
//         const result = await loaderService.insertParsedData(result);
//       }

//       res.status(200).json({ data: result });
//     } catch (err) {
//       res.status(500).json({ message: err });
//     }
//   }
// });

loaderRouter.post("/insertJsonStatSite", async (req: Request, res: Response) => {
  if (!req.files?.file) {
    res.status(500).json({ message: "No file found." });
  } else {
    try {
      const result = loaderService.parseJsonFile(req.files?.file);

      if (result.length > 0) {
        await loaderService.insertParsedSiteData;
      }

      res.status(200).json({ data: result });
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
});

loaderRouter.post("/insertJsonStatSiteDailyCount", async (req: Request, res: Response) => {
  if (!req.files?.file) {
    res.status(500).json({ message: "No file found." });
  } else {
    try {
      const result = loaderService.parseJsonFile(req.files?.file);

      if (result.length > 0) {
        await loaderService.insertParsedSiteDailyData(result);
      }

      res.status(200).json({ data: result });
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
});
