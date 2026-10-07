import { connectDB } from "../../lib/mongodb";
import Customer from "../../lib-account/Customer";
import { isValidEmail, normaliseEmail, normalisePhone, verifyPassword } from "../../lib-account/crypto";
import { fail, handler, ok, setSessionCookie } from "../../lib-account/session";

export const dynamic = "force-dynamic";

// POST /account-api/login { identifier (email or mobile), password }
export const POST = handler(async ({ body }) => {
  const identifier = String(body.identifier ?? body.email ?? "").trim();
  const password = String(body.password ?? "");
  if (!identifier) return fail("Enter your email or mobile number.", 400, { field: "identifier" });
  if (!password) return fail("Enter your password.", 400, { field: "password" });

  await connectDB();
  const email = normaliseEmail(identifier);
  const query = isValidEmail(email) ? { email } : { phone: normalisePhone(identifier) };
  const customer = await Customer.findOne(query);
  // Same message for unknown account and wrong password (no account enumeration).
  if (!customer || !verifyPassword(password, customer.passwordHash)) {
    return fail("Incorrect email/mobile or password.", 401);
  }
  customer.lastLoginAt = new Date();
  await customer.save();
  await setSessionCookie(customer);
  return ok({ customer: customer.toPublic() });
});
