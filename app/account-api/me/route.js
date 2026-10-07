import { isValidPhone, normalisePhone } from "../../lib-account/crypto";
import { fail, handler, ok } from "../../lib-account/session";

export const dynamic = "force-dynamic";

// GET /account-api/me → { ok, customer } (401 when signed out)
export const GET = handler(async ({ customer }) => ok({ customer: customer.toPublic() }), { auth: true });

// PATCH /account-api/me { name?, phone? }
export const PATCH = handler(
  async ({ body, customer }) => {
    if (body.name !== undefined) {
      const name = String(body.name).trim().slice(0, 80);
      if (name.length < 2) return fail("Please enter your name.", 400, { field: "name" });
      customer.name = name;
    }
    if (body.phone !== undefined) {
      const phone = normalisePhone(body.phone);
      if (!isValidPhone(phone)) return fail("Enter a valid 10-digit Indian mobile number.", 400, { field: "phone" });
      customer.phone = phone;
    }
    await customer.save();
    return ok({ customer: customer.toPublic() });
  },
  { auth: true }
);
