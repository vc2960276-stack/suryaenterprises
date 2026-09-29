import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            unique: true,
            required: true,
        },

        customer: {
            firstName: String,
            lastName: String,
            email: String,
            phone: String,
            address: String,
            apartment: String,
            city: String,
            state: String,
            pinCode: String,
            notes: String,
        },

        items: [
            {
                sku: String,
                name: String,
                quantity: Number,
                price: Number,
            },
        ],

        subtotal: Number,

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },

        razorpayOrderId: String,
        razorpayPaymentId: String,

        paymentMethod: {
            type: String,
            default: "razorpay",
        },
    },
    { timestamps: true }
);

export default mongoose.models.Order ||
    mongoose.model("Order", OrderSchema);