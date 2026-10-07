import { clearSessionCookie, handler, ok } from "../../lib-account/session";

export const dynamic = "force-dynamic";

// POST /account-api/logout
export const POST = handler(async () => {
  await clearSessionCookie();
  return ok({});
});
