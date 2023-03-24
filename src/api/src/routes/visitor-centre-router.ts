import express, { Request, Response } from "express";
import { param, body } from "express-validator";
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

visitorCentreRouter.get(
  "/:id/stats",
  [param("id").isNumeric().notEmpty()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    let vic = await db.getWithStats(parseInt(id), 10);
    return res.json({ data: vic });
  }
);

visitorCentreRouter.put(
  "/record-stats",
  [body("date").notEmpty(), body("site").notEmpty(), body("recorded_at").notEmpty()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    let { date, site, recorded_at } = req.body;

    if (site.id && date.date && date.origins) {
      let vic = await db.updateAndGetStats(site.id, date.date, date.origins, req.user.email, recorded_at);

      return res.json({ data: vic });
    }
    res.status(500).send();
  }
);

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
