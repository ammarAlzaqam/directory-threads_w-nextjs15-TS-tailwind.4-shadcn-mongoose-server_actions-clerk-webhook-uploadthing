import mongoose from "mongoose";

const cached = (global as any).mongoose || { conn: null, promise: null };

export default async function connectDB() {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) return console.log("MONGODB_URL not found");

  if (cached.conn) {
    console.log("Already connect to DB 🛫");
    return cached.conn;
  }
  try {
    if (!cached.promise) {
      cached.promise = mongoose
        .connect(process.env.MONGODB_URL as string)
        .then((conn) => conn.connection);
    }
    cached.conn = await cached.promise;
    (global as any).mongoose = cached.conn;
    return cached.conn;
  } catch (e: any) {
    console.log(`Failed to connect to DB: ${e.message}`);
  }
}
