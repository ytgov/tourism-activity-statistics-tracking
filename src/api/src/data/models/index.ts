import { ObjectId } from "mongodb";

export class MongoEntity {
  _id?: ObjectId;
}

export * from "./centre";
export * from "./user";
