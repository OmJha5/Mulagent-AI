import mongoose, { type Document } from "mongoose";
import {
  allowedPlans,
  billingConfig,
  paymentStatuses,
  type PaymentStatus,
  type PlanId,
} from "../constants/constants.ts";

export interface IPayment extends Document {
  userId: string;
  orderId: string;
  paymentId?: string | null;
  amount: number;
  currency: string;
  credits: number;
  plan: PlanId;
  status: PaymentStatus;
}

const paymentSchema = new mongoose.Schema<IPayment>(
  {
    userId: { type: String, required: true },
    orderId: { type: String, required: true, unique: true },
    paymentId: { type: String, default: null },
    amount: { type: Number, required: true },
    currency: { type: String, default: billingConfig.currency },
    credits: { type: Number, required: true },
    plan: {
      type: String,
      enum: allowedPlans,
      required: true,
    },
    status: {
      type: String,
      enum: paymentStatuses,
      default: "created",
    },
  },
  { timestamps: true },
);

export const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
