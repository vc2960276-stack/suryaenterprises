import { NextResponse } from "next/server";
import Razorpay from "razorpay";

function getRazorpay() {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
        throw new Error(
            "Razorpay credentials are not configured"
        );
    }

    return new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
    });
}

export async function POST(request) {
    try {
        const { amount } = await request.json();

        if (!amount || Number(amount) <= 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid amount",
                },
                { status: 400 }
            );
        }

        const razorpay = getRazorpay();

        const order = await razorpay.orders.create({
            amount: Math.round(Number(amount) * 100),
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        });

        return NextResponse.json({
            success: true,
            order,
        });
    } catch (error) {
        console.error("Razorpay order error:", error);

        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to create order",
            },
            { status: 500 }
        );
    }
}