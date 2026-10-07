import { randomBytes } from "node:crypto";
import { verifyPassword } from "../lib-account/crypto.js";
import { AdminError, digest } from "./core.mjs";

export const ADMIN_COOKIE = "surya_admin_session";
export const SESSION_SECONDS = 8 * 60 * 60;

export function createAdminAuth(db, { now = () => new Date() } = {}) {
  const sessions = db.collection("store_admin_sessions");
  const attempts = db.collection("store_admin_login_attempts");
  const settings = () => db.collection("store_admin_settings").findOne({ _id: "access" });
  const read = async token => {
    if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token)) return null;
    const configuration = await settings();
    if (!configuration?.keyHash) return null;
    return await sessions.findOne({ _id: digest(token), keyVersion: digest(configuration.keyHash), expiresAt: { $gt: now() } });
  };
  const login = async (key, client) => {
    const configuration = await settings();
    if (!configuration?.keyHash) throw new AdminError("Admin access has not been configured.", 503);
    const at = now(), bucket = Math.floor(at.getTime() / 600000);
    const record = await attempts.findOneAndUpdate({ _id: digest(`${client}:${bucket}`) },
      { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(at.getTime() + 1200000) } }, { upsert: true, returnDocument: "after" });
    if (record.count > 10) throw new AdminError("Too many attempts. Try again in 10 minutes.", 429);
    if (typeof key !== "string" || key.length > 200 || !verifyPassword(key, configuration.keyHash)) throw new AdminError("Incorrect access key.", 401);
    const token = randomBytes(32).toString("hex");
    await sessions.insertOne({ _id: digest(token), keyVersion: digest(configuration.keyHash), createdAt: at,
      expiresAt: new Date(at.getTime() + SESSION_SECONDS * 1000) });
    return token;
  };
  const logout = async token => {
    if (typeof token === "string" && /^[a-f0-9]{64}$/.test(token)) await sessions.deleteOne({ _id: digest(token) });
  };
  return { read, login, logout, settings };
}

export async function ensureAdminIndexes(db) {
  await Promise.all([
    db.collection("store_admin_sessions").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    db.collection("store_admin_login_attempts").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    db.collection("store_admin_orders").createIndex({ fulfillmentStatus: 1, _id: 1 }),
    db.collection("orders").createIndex({ paymentStatus: 1, provider: 1, updatedAt: -1, _id: -1 }),
    db.collection("orders").createIndex({ paymentStatus: 1, provider: 1, paidAt: -1, _id: -1 }),
  ]);
}
