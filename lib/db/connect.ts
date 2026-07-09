import mongoose from "mongoose";
import { getEnv } from "@/lib/env";

const MONGODB_URI = getEnv().MONGODB_URI || "";

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

const cached = global.mongooseCache || { conn: null, promise: null };
global.mongooseCache = cached;

export async function connectDb() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { dbName: "abseco" });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
