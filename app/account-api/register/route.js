import { connectDB } from "../../lib/mongodb";
import Customer from "../../lib-account/Customer";
import { hashPassword, isValidEmail, isValidPhone, normaliseEmail, normalisePhone } from "../../lib-account/crypto";
import { fail, handler, ok, setSessionCookie } from "../../lib-account/session";

export const dynamic = "force-dynamic";

// POST /account-api/register { name, email, phone, password }
export const POST = handler(async ({ body }) => {
  const name = String(body.name ?? "").trim().slice(0, 80);
  const email = normaliseEmail(body.email);
  const phone = normalisePhone(body.phone);
  const password = String(body.password ?? "");

  if (name.length < 2) return fail("Please enter your name.", 400, { field: "name" });
  if (!isValidEmail(email)) return fail("Enter a valid email address.", 400, { field: "email" });
  if (!isValidPhone(phone)) return fail("Enter a valid 10-digit Indian mobile number.", 400, { field: "phone" });
  if (password.length < 8) return fail("Password must be at least 8 characters.", 400, { field: "password" });

  await connectDB();
  const existing = await Customer.findOne({ email }).select("_id");
  if (existing) return fail("An account with this email already exists. Please sign in.", 409, { field: "email" });

  const customer = await Customer.create({ name, email, phone, passwordHash: hashPassword(password), lastLoginAt: new Date() });
  await setSessionCookie(customer);
  return ok({ customer: customer.toPublic() }, { status: 201 });
});
