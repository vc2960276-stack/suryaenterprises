import { validateAddress } from "../../../lib-account/addresses";
import { fail, handler, ok } from "../../../lib-account/session";

export const dynamic = "force-dynamic";

// PATCH /account-api/addresses/:id { ...address fields, isDefault? }
export const PATCH = handler(
  async ({ body, customer, params }) => {
    const existing = customer.addresses.id(params.id);
    if (!existing) return fail("Address not found.", 404);
    const merged = { ...existing.toObject(), ...body };
    const { value, error, field } = validateAddress(merged);
    if (error) return fail(error, 400, { field });
    if (value.isDefault) customer.addresses.forEach((a) => (a.isDefault = false));
    Object.assign(existing, value, { isDefault: value.isDefault || existing.isDefault });
    await customer.save();
    return ok({ addresses: customer.toPublic().addresses });
  },
  { auth: true }
);

// DELETE /account-api/addresses/:id
export const DELETE = handler(
  async ({ customer, params }) => {
    const existing = customer.addresses.id(params.id);
    if (!existing) return fail("Address not found.", 404);
    const wasDefault = existing.isDefault;
    existing.deleteOne();
    if (wasDefault && customer.addresses.length) customer.addresses[0].isDefault = true;
    await customer.save();
    return ok({ addresses: customer.toPublic().addresses });
  },
  { auth: true }
);
