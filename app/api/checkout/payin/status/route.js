import { NextResponse } from "next/server";
import { POST as checkPayInStatus } from "../../../v1/payin/check-status/route";
import { isSameOriginRequest } from "../../../../lib/requestOrigin";

export const dynamic = "force-dynamic";

// Browser checkout wrapper. The merchant API token stays server-side, so only
// requests coming from this site's own pages are accepted here.
export async function POST(request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ status: "error", error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const internalRequest = new Request(request.url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${process.env.PAYIN_API_TOKEN || ""}`,
      },
      body: JSON.stringify(body),
    });
    return await checkPayInStatus(internalRequest);
  } catch (error) {
    console.error("Checkout Pay-In status error:", error);
    return NextResponse.json({ status: "error", error: "Unable to check payment" }, { status: 500 });
  }
}
