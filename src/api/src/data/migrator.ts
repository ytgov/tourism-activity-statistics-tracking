import { Express, Request, Response } from "express";
import { sqldb } from "./index";
import { join } from "path";

export async function migrateUp() {
  console.log("-------- MIGRATE UP ---------");
  return await sqldb.migrate.up({ directory: join(__dirname, "migrations") });
}

export async function migrateDown() {
  console.log("-------- MIGRATE DOWN ---------");
  return await sqldb.migrate.down({ directory: join(__dirname, "migrations") });
}

export async function migrateLatest() {
  console.log("-------- MIGRATE LATEST ---------");
  return await sqldb.migrate.latest({ directory: join(__dirname, "migrations") });
}

export async function CreateMigrationRoutes(app: Express) {
  // this initializes the migration tables if they don't already exist
  await sqldb.migrate.list({ directory: join(__dirname, "migrations") });
  const level = await sqldb.migrate.status({ directory: join(__dirname, "migrations") });

  if (level < 0) {
    console.log("-------- Migrations are behind - I'm going run them for you ---------");
    await migrateLatest();
  }
  else {
    console.log("-------- Migrations are up to date ---------");
  }

  app.get("/migrate/up", async (req: Request, res: Response) => {
    res.send(await migrateUp());
  });

  app.get("/migrate/down", async (req: Request, res: Response) => {
    res.send(await migrateDown());
  });

  app.get("/migrate/latest", async (req: Request, res: Response) => {
    res.send(await migrateLatest());
  });
}
