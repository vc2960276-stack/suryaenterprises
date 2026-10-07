import fs from "node:fs";
import mongoose from "mongoose";
import { createOrdersStore } from "../app/lib-admin/orders-store.mjs";
import { dashboardFilters } from "../app/lib-admin/core.mjs";
import { withCatalogMedia } from "../app/products/data/catalog-media.mjs";

if (fs.existsSync(".env.local")) process.loadEnvFile(".env.local");
let conn;
try {
  const statement = JSON.parse(fs.readFileSync(0, "utf8"));
  if (statement.ownerReportedManualReview !== true || !process.env.MONGO_URL || !process.env.DB_NAME) throw new Error("Require an owner-review statement and the site's Mongo configuration.");
  const products = JSON.parse(fs.readFileSync("app/products/data/products.json", "utf8"));
  const media = JSON.parse(fs.readFileSync("app/products/data/catalog-media.json", "utf8"));
  conn = await mongoose.createConnection(process.env.MONGO_URL, { dbName: process.env.DB_NAME, maxPoolSize: 3, serverSelectionTimeoutMS: 15000 }).asPromise();
  const store = createOrdersStore(conn.db, null, products.map(product => withCatalogMedia(product, media)));
  const filters = dashboardFilters(new URLSearchParams({ range: statement.range || "all", ...(statement.from ? { from: statement.from } : {}), ...(statement.to ? { to: statement.to } : {}) }));
  console.log(JSON.stringify(await store.confirmReviewedAssociations(filters, statement)));
  console.log(statement.dryRun === true ? "Review preview only. No records changed." : "Owner-reported product associations recorded as Processing. Financial records and purchased line items were preserved.");
} catch (error) { console.error("Reviewed-order confirmation failed:", error.name); process.exitCode = 1; }
finally { if (conn) await conn.close(); }
