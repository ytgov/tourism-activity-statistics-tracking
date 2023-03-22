import express, { Request, Response } from "express";
import { param } from "express-validator";
import { checkJwt, loadUser } from "../middleware/authz.middleware";
import { ReturnValidationErrors } from "../middleware";
import { VisitorCentreService } from "../services";

export const visitorCentreRouter = express.Router();
visitorCentreRouter.use(checkJwt);
visitorCentreRouter.use(loadUser);

const db = new VisitorCentreService();

visitorCentreRouter.get("/", async (req: Request, res: Response) => {
  res.json({ data: await db.getAll() });
});

visitorCentreRouter.get("/:id/stats", async (req: Request, res: Response) => {
  const { id } = req.params;
  let vic = await db.getWithStats(parseInt(id), 10);
  return res.json({ data: vic });
});

visitorCentreRouter.put("/record-stats", async (req: Request, res: Response) => {
  let { date, site, recorded_at } = req.body;
  let vic = await db.updateAndGetStats(site.id, date.date, date.origins, req.user.email, recorded_at);

  return res.json({ data: vic });
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
