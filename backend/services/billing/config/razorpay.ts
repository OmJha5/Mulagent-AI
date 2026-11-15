import Razorpay from "razorpay";
import "dotenv/config";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId || !keySecret) {
  console.warn(
    "Warning: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not set in environment variables.",
  );
}

export const razorpay = new Razorpay({
  key_id: keyId || "placeholder_key",
  key_secret: keySecret || "placeholder_secret",
});
