const PRODUCTION_BACKEND_ORIGIN = "https://payin-frontend-hy1p.vercel.app";
const PRODUCTION_PUBLIC_ORIGIN = "https://www.suryaenter.in";

function publicOrigin(value, key) {
  let url;
  try { url = new URL(value); } catch { throw new Error(`${key} must be a configured HTTPS origin`); }
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash || url.pathname !== "/" || /(?:^localhost$|^127\.|\.(?:example|invalid|local|internal)$)/i.test(url.hostname)) {
    throw new Error(`${key} must be a public HTTPS origin without credentials or a path`);
  }
  return url.origin;
}

export function gatewayRewrites(env) {
  const configuredTarget = String(env.PAYIN_BACKEND_ORIGIN || "").trim();
  const rawTarget = configuredTarget || (env.NODE_ENV === "production" ? PRODUCTION_BACKEND_ORIGIN : "");
  if (!rawTarget) {
    return [];
  }
  const target = publicOrigin(rawTarget, "PAYIN_BACKEND_ORIGIN");
  const website = publicOrigin(env.PUBLIC_BASE_URL || PRODUCTION_PUBLIC_ORIGIN, "PUBLIC_BASE_URL");
  if (new URL(target).hostname.replace(/^www\./, "") === new URL(website).hostname.replace(/^www\./, "")) {
    throw new Error("PAYIN_BACKEND_ORIGIN must be the separate API host to prevent a rewrite loop");
  }
  return [
    { source: "/pay/:path*", destination: `${target}/pay/:path*` },
    { source: "/gateway/:path*", destination: `${target}/:path*` }
  ];
}

export function validatePaymentEnvironment(env) {
  if (env.NODE_ENV !== "production") return;
  gatewayRewrites(env);
  for (const key of ["MONGO_URL", "DB_NAME", "PAYU_KEY", "PAYU_SALT", "PAYIN_API_TOKEN", "PAYIN_BACKEND_WEBHOOK_URL"]) {
    if (!String(env[key] || "").trim() || /<[^>]+>/.test(String(env[key]))) throw new Error(`${key} must be configured for production`);
  }
  if (!/^mongodb(?:\+srv)?:\/\//.test(env.MONGO_URL)) throw new Error("MONGO_URL must be a configured MongoDB URI");
  if (/^(test|demo|e2e)$|(?:demo|e2e)[_-]/i.test(env.DB_NAME)) throw new Error("DB_NAME must identify the production database");
  if (env.PAYU_ENV !== "production") throw new Error("PAYU_ENV must be production for the live deployment");
  if (env.PAYIN_API_TOKEN.length < 32) throw new Error("PAYIN_API_TOKEN must be at least 32 characters");
  const website = publicOrigin(env.PUBLIC_BASE_URL || PRODUCTION_PUBLIC_ORIGIN, "PUBLIC_BASE_URL");
  const callback = new URL(env.PAYIN_BACKEND_WEBHOOK_URL);
  if (callback.origin !== website || callback.pathname !== "/gateway/api/webhooks/payu/payment" || callback.username || callback.password || callback.search || callback.hash) {
    throw new Error("PAYIN_BACKEND_WEBHOOK_URL must be the public gateway PayU webhook URL");
  }
}
