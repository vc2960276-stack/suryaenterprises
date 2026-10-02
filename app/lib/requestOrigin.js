/**
 * True when the request was sent by a browser page served from this same site.
 *
 * Used to guard the browser-only checkout wrappers, which inject the server-side
 * Pay-In token. Server-to-server callers must use /api/v1/payin/* with a token.
 */
export function isSameOriginRequest(request) {
  const origin = request.headers.get("origin");

  const host =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host");

  if (!origin || !host) {
    return false;
  }

  try {
    return new URL(origin).host === host.split(",")[0].trim();
  } catch {
    return false;
  }
}
