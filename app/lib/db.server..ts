import { MongoClient } from "mongodb";  
  
const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not defined");
}

const client = new MongoClient(uri);  
  
let db: any;  
  
export const connectDB = async () => {  
  db = client.db("peterhiku12");  
};  
  
export const getDB = () => {  
  if (!db) {  
    throw new Error("Database not initialized");  
  }  
  return db;  
};  
