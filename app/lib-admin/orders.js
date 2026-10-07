import "server-only";
import products from "../products/data/products.json";
import media from "../products/data/catalog-media.json";
import { withCatalogMedia } from "../products/data/catalog-media.mjs";
import { createOrdersStore } from "./orders-store.mjs";

const catalog = products.map(p => withCatalogMedia(p, media));
export async function ordersFor(context) {
  const configuration = await context.access.settings();
  const gateway = configuration?.payinDbName ? context.client.db(configuration.payinDbName) : null;
  return createOrdersStore(context.db, gateway, catalog);
}
