import express, { Request, Response } from "express";
import { param, body } from "express-validator";
import { checkJwt, loadUser } from "../middleware/authz.middleware";
import { ReturnValidationErrors } from "../middleware";
import { requireAdmin } from "../middleware/permissions";
import { VisitorCentreService } from "../services";
import { sign } from "jsonwebtoken";
import { METABASE_KEY, METABASE_URL, METABASE_ID } from "../config";

export const visitorCentreRouter = express.Router();
visitorCentreRouter.use(checkJwt);
visitorCentreRouter.use(loadUser);

const db = new VisitorCentreService();

visitorCentreRouter.get("/", async (req: Request, res: Response) => {
  let list = await db.getAll();

  for (let item of list) {
    item.reminders_at = ((item.reminders_at || "") as string).split(",").filter((i) => i.length > 0);
  }

  res.json({ data: list });
});

visitorCentreRouter.get("/token", async (req: Request, res: Response) => {
  if (METABASE_ID && METABASE_KEY) {
    var payload = {
      resource: { dashboard: parseInt(METABASE_ID) },
      params: {},
      exp: Math.round(Date.now() / 1000) + 10 * 60, // 60 minute expiration
    };

    try {
      let token = sign(payload, METABASE_KEY);
      return res.json({ data: { token, metabase_url: METABASE_URL } });
    } catch (e) {
      return res.json({ data: { token: "12345", metabase_url: "" } });
    }
  }

  res.json({ data: { token: "12345", metabase_url: "" } });
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
  requireAdmin,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    await db.update(parseInt(id), req.body);

    res.json({ data: req.body });
  }
);

visitorCentreRouter.post("/", requireAdmin, async (req: Request, res: Response) => {
  await db.create(req.body);

  res.json({ data: req.body });
});

visitorCentreRouter.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  res.json({});
});
