// Display helpers shared by server and client components.
export const formatPrice = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

export const discountPercent = (price, mrp) =>
  mrp && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

export const LOW_STOCK = 10;
