import { MongoClient } from "mongodb";
import type { Db } from "mongodb";

let client: MongoClient | undefined;
let db: Db | undefined;

export const connectDB = async () => {
  if (!client) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not defined");
    }
    // strip whitespace + empty query params (`?&`, `&&`, trailing `&`) that
    // sneak in via env-var pasting and make the driver throw MongoParseError
    const clean = uri
      .trim()
      .replace(/\?&+/, "?")
      .replace(/&{2,}/g, "&")
      .replace(/[?&]+$/, "");
    client = new MongoClient(clean);
  }
  db = client.db("peterhiku12");
};
  
export const getDB = () => {  
  if (!db) {  
    throw new Error("Database not initialized");  
  }  
  return db;  
};  
