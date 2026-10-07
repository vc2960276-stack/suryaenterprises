// Resolve prices and names on the server; the browser supplies only SKU/count.
export function prepareStorefrontPurchase(body, catalog) {
  if (!Array.isArray(body.items) || body.items.length < 1 || body.items.length > 100) throw new Error("Select valid products before paying.");
  const products = new Map(catalog.map(p => [p.sku, p]));
  const quantities = new Map();
  for (const line of body.items) {
    if (typeof line?.sku !== "string" || !Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 100) throw new Error("Invalid product quantity.");
    quantities.set(line.sku, (quantities.get(line.sku) || 0) + line.quantity);
  }
  const items = [...quantities].map(([sku, quantity]) => {
    const product = products.get(sku);
    if (!product || !Number.isFinite(product.price) || product.price <= 0 || quantity > 100 || (typeof product.stock === "number" && quantity > product.stock)) throw new Error("A selected product is unavailable. Update your cart.");
    return { sku, name: product.name, quantity, price: product.price };
  });
  const cents = items.reduce((sum, i) => sum + Math.round(i.price * 100) * i.quantity, 0);
  if (!Number.isSafeInteger(cents) || cents !== Math.round(Number(body.amount) * 100)) throw new Error("Cart prices changed. Refresh checkout before paying.");
  const shipping = body.shipping || {};
  const customer = {};
  for (const [field, max] of [["address", 300], ["apartment", 100], ["city", 100], ["state", 100], ["pinCode", 6], ["notes", 1000]]) {
    const value = String(shipping[field] || "").trim();
    if (value.length > max) throw new Error("Check your shipping details.");
    customer[field] = value;
  }
  if (!customer.address || !customer.city || !customer.state || !/^[1-9]\d{5}$/.test(customer.pinCode)) throw new Error("Enter a complete shipping address and valid PIN code.");
  return { items, customer, subtotal: cents / 100 };
}
