import express, { Request, Response } from "express";
import { checkJwt, loadUser } from "../middleware/authz.middleware";
import { KioskDataService } from "../services";
import moment from "moment";

export const kioskDataRouter = express.Router();
kioskDataRouter.use(checkJwt);
kioskDataRouter.use(loadUser);

const db = new KioskDataService();

kioskDataRouter.get("/", async (req: Request, res: Response) => {
  let list = await db.getAll();

  let vals = new Array<any>();

  for (let item of list) {
    (item.start_date as any) = moment.utc(item.start_date).format("YYYY-MM-DD");
    (item.end_date as any) = moment.utc(item.end_date).format("YYYY-MM-DD");

    let match = vals.find(
      (v) => v.kiosk_name == item.kiosk_name && v.start_date == item.start_date && v.end_date == item.end_date
    );

    if (match) {
      match.items.push({
        playout_id: item.id,
        playout_item: item.playout_item,
        playout_count: item.playout_count,
        playout_seconds: item.playout_seconds,
      });
    } else {
      vals.push({
        kiosk_name: item.kiosk_name,
        start_date: item.start_date,
        end_date: item.end_date,
        items: [
          {
            playout_id: item.id,
            playout_item: item.playout_item,
            playout_count: item.playout_count,
            playout_seconds: item.playout_seconds,
          },
        ],
      });
    }
  }

  res.json({ data: vals });
});

kioskDataRouter.post("/", async (req: Request, res: Response) => {
  let { kiosk_name, start_date, end_date, items } = req.body;

  for (let row of items) {
    let rowId = row.playout_id;

    let item = {
      kiosk_name,
      start_date,
      end_date,
      playout_item: row.playout_item,
      playout_count: row.playout_count,
      playout_seconds: row.playout_seconds,
    };

    if (rowId) {
      await db.update(parseInt(rowId), item);
    } else {
      await db.create(item);
    }
  }

  res.json({ data: req.body });
});

kioskDataRouter.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  await db.delete(parseInt(id));
  res.json({});
});
