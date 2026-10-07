import fs from "node:fs";
import mongoose from "mongoose";
import { hashPassword } from "../app/lib-account/crypto.js";
import { ensureAdminIndexes } from "../app/lib-admin/auth-store.mjs";

// Reads the key privately from stdin; never include credentials in Git/CLI args.
if (fs.existsSync(".env.local")) process.loadEnvFile(".env.local");
const uri = process.env.MONGO_URL, dbName = process.env.DB_NAME;
if (!uri || !dbName) throw new Error("Set MONGO_URL and DB_NAME before configuring admin.");
const args = process.argv.slice(2), index = args.indexOf("--payin-db");
const payinDbName = index >= 0 ? args[index + 1] : undefined;
if (payinDbName !== undefined && (!payinDbName || !/^[A-Za-z0-9_-]{1,64}$/.test(payinDbName))) throw new Error("Use a valid Pay-In database name.");
const key = fs.readFileSync(0, "utf8").replace(/[\r\n]+$/, "");
if (key.length < 8 || key.length > 200) throw new Error("Supply an access key of 8–200 characters via stdin.");
const conn = await mongoose.createConnection(uri, { dbName, maxPoolSize: 2, serverSelectionTimeoutMS: 15000 }).asPromise();
try {
  await ensureAdminIndexes(conn.db);
  await conn.db.collection("store_admin_settings").updateOne({ _id: "access" },
    { $set: { keyHash: hashPassword(key), updatedAt: new Date(), ...(payinDbName ? { payinDbName } : {}) } }, { upsert: true });
  console.log("Admin access configured. Existing sessions are invalidated; no financial records changed.");
} finally { await conn.close(); }
