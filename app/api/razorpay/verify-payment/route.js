import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request) {
    try {
        const body = await request.json();

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            details,
            cartItems,
            subtotal,
        } = body;

        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                `${razorpay_order_id}|${razorpay_payment_id}`
            )
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid payment signature",
                },
                { status: 400 }
            );
        }

        // Payment verified successfully.
        // Save the order in MongoDB here.

        console.log("Payment successful:", {
            razorpay_order_id,
            razorpay_payment_id,
            details,
            cartItems,
            subtotal,
        });

        return NextResponse.json({
            success: true,
            message: "Payment verified successfully",
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                error: "Payment verification failed",
            },
            { status: 500 }
        );
    }
}