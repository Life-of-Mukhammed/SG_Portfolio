import { MongoClient, type Db } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var __mongoClient: MongoClient | undefined;
  // eslint-disable-next-line no-var
  var __mongoConnect: Promise<MongoClient> | undefined;
}

function client(): MongoClient {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }
  if (!global.__mongoClient) {
    global.__mongoClient = new MongoClient(uri, {
      serverSelectionTimeoutMS: 8000,
    });
  }
  return global.__mongoClient;
}

export async function getMongo(): Promise<MongoClient> {
  if (!global.__mongoConnect) {
    global.__mongoConnect = client().connect();
  }
  return global.__mongoConnect;
}

export async function getResidencyDb(): Promise<Db> {
  const c = await getMongo();
  return c.db("residency");
}
