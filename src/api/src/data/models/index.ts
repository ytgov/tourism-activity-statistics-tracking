import { ObjectId } from "mongodb";

export class MongoEntity {
  _id?: ObjectId;
}

export * from "./visitor-centre";
export * from "./user";
