import express, { Request, Response } from "express";
import { param, body } from "express-validator";
import { checkJwt, loadUser } from "../middleware/authz.middleware";
import { ReturnValidationErrors } from "../middleware";
import { VisitorCentreService } from "../services";
import { sign } from "jsonwebtoken";

export const visitorCentreRouter = express.Router();
visitorCentreRouter.use(checkJwt);
visitorCentreRouter.use(loadUser);

const db = new VisitorCentreService();

visitorCentreRouter.get("/", async (req: Request, res: Response) => {
  res.json({ data: await db.getAll() });
});

visitorCentreRouter.get("/token", async (req: Request, res: Response) => {
  const metabaseKey = "8d23d67d7c6df376190dfc1b31222e47c4f3454fcbe7bf9cd82ba53e050f0980";
  const metabase_url = "http://localhost:3100";

  var payload = {
    resource: { dashboard: 1 },
    params: {},
    exp: Math.round(Date.now() / 1000) + 10 * 60, // 10 minute expiration
  };
  let token = sign(payload, metabaseKey);

  res.json({ data: { token, metabase_url } });
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
