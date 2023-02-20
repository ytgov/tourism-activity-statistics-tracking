import express, { Request, Response } from "express";
import { param } from "express-validator";
import { ReturnValidationErrors } from "../middleware";
import { VisitorCentreService } from "../services";

export const visitorCentreRouter = express.Router();

const db = new VisitorCentreService();

visitorCentreRouter.get("/", async (req: Request, res: Response) => {
  res.json({ data: await db.getAll() });
});

visitorCentreRouter.put(
  "/:id",
  [param("id").notEmpty()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    await db.update(parseInt(id), req.body);

    res.json({ data: req.body });
  }
);

visitorCentreRouter.post("/", async (req: Request, res: Response) => {
  await db.create(req.body);

  res.json({ data: req.body });
});

visitorCentreRouter.delete("/:id", async (req: Request, res: Response) => {
  res.json({});
});
