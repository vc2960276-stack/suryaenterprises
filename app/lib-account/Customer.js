// Customer accounts for the storefront. Lives outside the frozen app/models
// directory on purpose; orders are still matched to customers by email/phone
// (see app/account-api/orders/route.js) so app/models/Order.js is untouched.
import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    label: { type: String, default: "Home", trim: true, maxlength: 40 },
    firstName: { type: String, trim: true, maxlength: 60 },
    lastName: { type: String, trim: true, maxlength: 60 },
    address: { type: String, trim: true, maxlength: 200 },
    apartment: { type: String, trim: true, maxlength: 120 },
    city: { type: String, trim: true, maxlength: 80 },
    state: { type: String, trim: true, maxlength: 60 },
    pinCode: { type: String, trim: true, maxlength: 6 },
    phone: { type: String, trim: true, maxlength: 10 },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    phone: { type: String, required: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    addresses: { type: [AddressSchema], default: [] },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

// Plain, client-safe shape (never includes the password hash).
CustomerSchema.methods.toPublic = function toPublic() {
  return {
    id: String(this._id),
    name: this.name,
    email: this.email,
    phone: this.phone,
    createdAt: this.createdAt,
    addresses: (this.addresses ?? []).map((a) => ({
      id: String(a._id),
      label: a.label,
      firstName: a.firstName ?? "",
      lastName: a.lastName ?? "",
      address: a.address ?? "",
      apartment: a.apartment ?? "",
      city: a.city ?? "",
      state: a.state ?? "",
      pinCode: a.pinCode ?? "",
      phone: a.phone ?? "",
      isDefault: Boolean(a.isDefault),
    })),
  };
};

export default mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);
