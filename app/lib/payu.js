import crypto from "crypto";

const PAYU_ENV = process.env.PAYU_ENV || "test";
const PAYU_KEY = process.env.PAYU_KEY;
const PAYU_SALT = process.env.PAYU_SALT;

function assertPayUConfig() {
  if (!PAYU_KEY || !PAYU_SALT) {
    throw new Error(
      "PAYU_KEY and PAYU_SALT are required"
    );
  }
}

function sha512(value) {
  return crypto
    .createHash("sha512")
    .update(value)
    .digest("hex");
}

/**
 * PayU standard payment hash
 *
 * SHA512(
 *   key|txnid|amount|productinfo|firstname|email|
 *   udf1|udf2|udf3|udf4|udf5||||||SALT
 * )
 */
export function generatePayUPaymentHash({
  txnid,
  amount,
  productinfo,
  firstname,
  email,
  udf1 = "",
  udf2 = "",
  udf3 = "",
  udf4 = "",
  udf5 = "",
}) {
  assertPayUConfig();

  const hashString = [
    PAYU_KEY,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    udf1,
    udf2,
    udf3,
    udf4,
    udf5,
    "",
    "",
    "",
    "",
    "",
    PAYU_SALT,
  ].join("|");

  console.log("========== PAYU HASH ==========");
  console.log({
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    udf1,
    udf2,
    udf3,
    udf4,
    udf5,
  });
  console.log("===============================");

  return sha512(hashString);
}

/**
 * PayU UPI Intent / S2S Intent
 *
 * This is NOT Dynamic QR.
 *
 * PayU:
 *   pg = UPI
 *   bankcode = INTENT
 *   txn_s2s_flow = 4
 */
export async function createPayUIntent({
  txnid,
  amount,
  productinfo,
  firstname,
  email,
  phone,
  successUrl,
  failureUrl,
  clientIp,
  deviceInfo,
  udf1 = "",
  udf2 = "",
  udf3 = "",
  udf4 = "",
  udf5 = "",
}) {
  assertPayUConfig();

  const endpoint =
    PAYU_ENV === "production"
      ? "https://secure.payu.in/_payment"
      : "https://test.payu.in/_payment";

  const formattedAmount = Number(amount).toFixed(2);

  // --------------------------------
  // Generate PayU hash
  // --------------------------------

  const hash = generatePayUPaymentHash({
    txnid,
    amount: formattedAmount,
    productinfo,
    firstname,
    email,
    udf1,
    udf2,
    udf3,
    udf4,
    udf5,
  });

  // --------------------------------
  // Build PayU request
  // --------------------------------

  const params = new URLSearchParams();

  params.set("key", PAYU_KEY);
  params.set("txnid", txnid);
  params.set("amount", formattedAmount);
  params.set("productinfo", productinfo);
  params.set("firstname", firstname);
  params.set("email", email);
  params.set("phone", phone);

  // Callback URLs
  params.set("surl", successUrl);
  params.set("furl", failureUrl);

  // --------------------------------
  // UPI INTENT
  // --------------------------------

  params.set("pg", "UPI");
  params.set("bankcode", "INTENT");
  params.set("txn_s2s_flow", "4");

  // --------------------------------
  // UDF
  // --------------------------------

  params.set("udf1", udf1);
  params.set("udf2", udf2);
  params.set("udf3", udf3);
  params.set("udf4", udf4);
  params.set("udf5", udf5);

  // --------------------------------
  // Server-to-server information
  // --------------------------------

  params.set(
    "s2s_client_ip",
    clientIp || "127.0.0.1"
  );

  params.set(
    "s2s_device_info",
    deviceInfo || "Surya-Enterprise-Payin"
  );

  // --------------------------------
  // Hash
  // --------------------------------

  params.set("hash", hash);

  console.log(
    "========== PAYU UPI INTENT REQUEST =========="
  );

  console.log({
    endpoint,
    txnid,
    amount: formattedAmount,
    pg: "UPI",
    bankcode: "INTENT",
    txn_s2s_flow: "4",
    clientIp,
    deviceInfo,
  });

  console.log(
    "============================================="
  );

  // --------------------------------
  // Call PayU
  // --------------------------------

  const response = await fetch(endpoint, {
    method: "POST",

    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type":
        "application/x-www-form-urlencoded",
    },

    body: params.toString(),

    cache: "no-store",
  });

  const raw = await response.text();

  console.log(
    "========== PAYU INTENT RAW RESPONSE =========="
  );

  console.log(raw);

  console.log(
    "==============================================="
  );

  // --------------------------------
  // Parse response
  // --------------------------------

  let payload;

  try {
    payload = JSON.parse(raw);
  } catch {
    payload = {
      raw,
    };
  }

  console.log(
    "========== PAYU INTENT PARSED RESPONSE =========="
  );

  console.log(
    JSON.stringify(payload, null, 2)
  );

  console.log(
    "================================================="
  );

  // --------------------------------
  // HTTP error
  // --------------------------------

  if (!response.ok) {
    throw new Error(
      payload?.metaData?.message ||
      payload?.message ||
      payload?.msg ||
      raw ||
      `PayU returned HTTP ${response.status}`
    );
  }

  // --------------------------------
  // Extract PayU result
  // --------------------------------

  const result =
    payload?.result || {};

  // PayU returns:
  //
  // intentURIData:
  // pa=xxx&pn=xxx&tr=xxx&tid=xxx&am=xxx&cu=INR...
  //
  const intentURIData =
    result?.intentURIData ||
    result?.intentUri ||
    result?.intentURI ||
    payload?.intentURIData ||
    payload?.intentUri ||
    null;

  // --------------------------------
  // Build actual UPI deep link
  // --------------------------------

  const intentUri =
    intentURIData
      ? `upi://pay?${intentURIData}`
      : null;

  // Optional PayU intent URL
  const intentUrl =
    result?.intentUrl ||
    null;

  // --------------------------------
  // Make sure PayU returned intent
  // --------------------------------

  if (!intentUri) {
    const payuMessage =
      payload?.metaData?.message ||
      payload?.metaData?.txnMessage ||
      payload?.message ||
      payload?.msg ||
      result?.message ||
      result?.msg ||
      "PayU did not return a UPI intent";

    throw new Error(
      `PayU UPI Intent failed: ${payuMessage}. ` +
      `Full response: ${JSON.stringify(payload)}`
    );
  }

  // --------------------------------
  // SUCCESS
  // --------------------------------

  console.log(
    "========== PAYU UPI DEEP LINK =========="
  );

  console.log(intentUri);

  console.log(
    "========================================="
  );

  return {
    txnId:
      payload?.metaData?.txnId ||
      txnid,

    transactionStatus:
      payload?.metaData?.txnStatus ||
      "pending",

    paymentId:
      result?.paymentId ||
      null,

    merchantVpa:
      result?.merchantVpa ||
      null,

    merchantName:
      result?.merchantName ||
      null,

    // Original PayU intent data
    intentURIData,

    // Actual UPI deep link
    intentUri,

    // Optional PayU URL
    intentUrl,

    // Complete PayU response
    raw: payload,
  };
}

/**
 * Verify PayU payment
 */
export async function verifyPayUPayment(
  txnid
) {
  assertPayUConfig();

  const endpoint =
    PAYU_ENV === "production"
      ? "https://info.payu.in/merchant/postservice.php?form=2"
      : "https://test.payu.in/merchant/postservice.php?form=2";

  const command =
    "verify_payment";

  const hash = sha512(
    [
      PAYU_KEY,
      command,
      txnid,
      PAYU_SALT,
    ].join("|")
  );

  const response =
    await fetch(
      endpoint,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },

        body:
          new URLSearchParams({
            key: PAYU_KEY,
            command,
            var1: txnid,
            hash,
          }).toString(),

        cache: "no-store",
      }
    );

  const raw =
    await response.text();

  let payload;

  try {
    payload =
      JSON.parse(raw);
  } catch {
    payload = {
      raw,
    };
  }

  if (!response.ok) {
    throw new Error(
      payload?.msg ||
      raw ||
      "PayU verify payment failed"
    );
  }

  return payload;
}


/**
 * Verify PayU callback hash
 */
export function verifyPayUCallbackHash(
  data
) {
  assertPayUConfig();

  const expected =
    sha512(
      [
        PAYU_SALT,
        data.status || "",
        "",
        "",
        "",
        "",
        "",
        data.udf5 || "",
        data.udf4 || "",
        data.udf3 || "",
        data.udf2 || "",
        data.udf1 || "",
        data.email || "",
        data.firstname || "",
        data.productinfo || "",
        data.amount || "",
        data.txnid || "",
        data.key || PAYU_KEY,
      ].join("|")
    );

  const received =
    String(data.hash || "")
      .toLowerCase();

  if (
    !/^[a-f0-9]{128}$/.test(
      received
    )
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(
      expected,
      "hex"
    ),
    Buffer.from(
      received,
      "hex"
    )
  );
}