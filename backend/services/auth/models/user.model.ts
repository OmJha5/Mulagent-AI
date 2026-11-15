import mongoose, { type Document } from "mongoose";
import {
  allowedPlans,
  authConfig,
  type AllowedPlan,
} from "../constants/constants.ts";

export interface IUser extends Document {
  firebaseUid: string;
  name: string;
  email?: string;
  avatar?: string;

  plan: AllowedPlan;
  credits: number;
  totalCredits: number;
  planExpiresAt?: Date | null;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    firebaseUid: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    email: { type: String, default: "" },
    avatar: { type: String, default: "" },

    plan: {
      type: String,
      enum: allowedPlans,
      default: authConfig.defaultPlan,
    },
    credits: { type: Number, default: authConfig.defaultCredits },
    totalCredits: { type: Number, default: authConfig.defaultCredits },
    planExpiresAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>("User", userSchema);
