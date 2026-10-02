import mongoose from "mongoose";
import { validatePaymentEnvironment } from "../../deployment-config.mjs";

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
    throw new Error("Please define MONGO_URL in .env.local");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null,
    };
}

export async function connectDB() {
    validatePaymentEnvironment(process.env);
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const options = {};

        // Optional: pin the database. Without it Mongoose uses the URI default ("test").
        if (process.env.DB_NAME) {
            options.dbName = process.env.DB_NAME;
        }

        cached.promise = mongoose.connect(MONGO_URL, options).catch((error) => {
            cached.promise = null;
            throw error;
        });
    }

    cached.conn = await cached.promise;

    return cached.conn;
}
