import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
    try {
        const body = await request.json();

        const { amount } = body;

        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: "Invalid payment amount" },
                { status: 400 }
            );
        }

        // Amount must be in paise.
        const options = {
            amount: Math.round(Number(amount) * 100),
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            success: true,
            order,
        });
    } catch (error) {
        console.error("Razorpay order error:", error);

        return NextResponse.json(
            { error: "Unable to create payment order" },
            { status: 500 }
        );
    }
}