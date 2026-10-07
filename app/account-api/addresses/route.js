import { sameAddress, validateAddress } from "../../lib-account/addresses";
import { fail, handler, ok } from "../../lib-account/session";

export const dynamic = "force-dynamic";

const MAX_ADDRESSES = 10;

// GET /account-api/addresses
export const GET = handler(async ({ customer }) => ok({ addresses: customer.toPublic().addresses }), { auth: true });

// POST /account-api/addresses { ...address, isDefault?, skipIfDuplicate? }
// `skipIfDuplicate` is used by checkout: it quietly reuses an existing entry
// for the same street/city/PIN instead of creating a copy.
export const POST = handler(
  async ({ body, customer }) => {
    const { value, error, field } = validateAddress(body);
    if (error) return fail(error, 400, { field });

    const duplicate = customer.addresses.find((a) => sameAddress(value, a));
    if (duplicate && body.skipIfDuplicate) {
      return ok({ addresses: customer.toPublic().addresses, reused: String(duplicate._id) });
    }
    if (customer.addresses.length >= MAX_ADDRESSES) return fail(`You can save up to ${MAX_ADDRESSES} addresses.`, 400);

    const makeDefault = value.isDefault || customer.addresses.length === 0;
    if (makeDefault) customer.addresses.forEach((a) => (a.isDefault = false));
    customer.addresses.push({ ...value, isDefault: makeDefault });
    await customer.save();
    const created = customer.addresses[customer.addresses.length - 1];
    return ok({ addresses: customer.toPublic().addresses, created: String(created._id) }, { status: 201 });
  },
  { auth: true }
);
