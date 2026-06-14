import mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  throw new Error("Please define the MONGO_URL environment variable inside .env");
}

// ۱۔ پہلے ایرر کا حل: global کی ٹائپ سیٹ کرنا تاکہ ٹائپ سکرپٹ اعتراض نہ کرے
interface GlobalMongoose {
  mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

const globalWithMongoose = global as unknown as GlobalMongoose;

let cached = globalWithMongoose.mongoose;

if (!cached) {
  cached = globalWithMongoose.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000,
    };

    // ۲۔ دوسرے ایرر کا حل: MONGO_URL کے آگے as string لگا کر ٹائپ پکی کر دی
    cached!.promise = mongoose.connect(MONGO_URL as string, opts).then((mongooseInstance) => {
      console.log("✅ MongoDB Connected Successfully to Vercel!");
      return mongooseInstance;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    console.error("❌ MongoDB Connection Error:", e);
    throw e;
  }

  return cached!.conn;
}

export default dbConnect;