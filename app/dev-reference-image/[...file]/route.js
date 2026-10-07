// GET /dev-reference-image/<file> — DEVELOPMENT ONLY.
//
// Streams a reference image listed in the local overlay
// (app/products/data/reference-overlay.json, git-ignored) straight from the
// source folder on disk so nothing is copied into public/. In any other
// NODE_ENV the handler returns 404 immediately; the overlay loader also
// returns null outside development, so there is no file to serve.
import { createReadStream, statSync } from "node:fs";
import { Readable } from "node:stream";
import { resolveReferenceImage } from "../../products/data/reference-overlay.server";

export const dynamic = "force-dynamic";

const TYPES = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", gif: "image/gif" };
const notFound = () => new Response(null, { status: 404 });

export async function GET(_request, { params }) {
  if (process.env.NODE_ENV !== "development") return notFound();
  const { file } = await params;
  const name = Array.isArray(file) ? file.join("/") : String(file ?? "");
  // One plain file name: letters, digits, dot, dash, underscore — no slashes, no dot-files.
  if (!/^[A-Za-z0-9_-][A-Za-z0-9._-]*$/.test(name)) return notFound();
  const type = TYPES[name.split(".").pop().toLowerCase()];
  if (!type) return notFound();
  const abs = resolveReferenceImage(name);
  if (!abs) return notFound();
  const { size } = statSync(abs);
  return new Response(Readable.toWeb(createReadStream(abs)), {
    headers: {
      "Content-Type": type,
      "Content-Length": String(size),
      "Cache-Control": "private, max-age=3600",
      "X-Robots-Tag": "noindex",
    },
  });
}
