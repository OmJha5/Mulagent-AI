import crypto from "node:crypto";
import axios from "axios";
import { type Request, type Response } from "express";
import { razorpay } from "../config/razorpay.ts";
import { billingConfig, PLANS, type PlanId } from "../constants/constants.ts";
import { Payment } from "../models/payment.model.ts";

export const getPlans = (_req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    plans: Object.values(PLANS),
  });
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { plan } = req.body;
    const userId =
      (req.headers["x-user-id"] as string | undefined) || req.body.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID is required to create a payment order",
      });
    }

    if (!plan || !(plan in PLANS)) {
      return res.status(400).json({
        success: false,
        message: `Invalid plan specified. Available plans: ${Object.keys(PLANS).join(", ")}`,
      });
    }

    const selectedPlan = PLANS[plan as PlanId];

    if (selectedPlan.amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Free plan does not require purchase.",
      });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(selectedPlan.amount * 100), // In paise (1 INR = 100 paise)
      currency: billingConfig.currency,
      receipt: `${billingConfig.defaultReceiptPrefix}-${Date.now()}`,
    });

    await Payment.create({
      userId,
      orderId: order.id,
      amount: selectedPlan.amount,
      credits: selectedPlan.credits,
      plan: selectedPlan.id,
      currency: order.currency,
      status: "created",
    });

    return res.status(200).json({
      success: true,
      order,
      plan: selectedPlan,
    });
  } catch (error) {
    console.error("Error creating payment order:", error);
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create order",
    });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message:
          "Missing payment verification parameters: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required.",
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      throw new Error(
        "RAZORPAY_KEY_SECRET is not configured in environment variables.",
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed: Signature mismatch.",
      });
    }

    const payment = await Payment.findOne({ orderId: razorpay_order_id });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found for the given order ID.",
      });
    }

    payment.status = "paid";
    payment.paymentId = razorpay_payment_id;
    await payment.save();

    const authServiceUrl = process.env.AUTH_SERVICE_URL;
    if (authServiceUrl) {
      await axios.post(
        `${authServiceUrl}/update-plan`,
        {
          userId: payment.userId,
          plan: payment.plan,
          credits: payment.credits,
        },
        {
          headers: {
            [billingConfig.internalSecretHeader]:
              process.env.INTERNAL_SERVICE_SECRET || "",
          },
        },
      );
    } else {
      console.warn(
        "AUTH_SERVICE_URL is not set; user plan and credits in auth service could not be automatically updated.",
      );
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified and credits added successfully",
      plan: payment.plan,
      credits: payment.credits,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to verify payment",
    });
  }
};
