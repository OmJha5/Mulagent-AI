import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import { connectToDB } from "./config/db.ts";
import billingRoutes from "./routes/billing.route.ts";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8004;

app.use(express.json());

app.use("/", billingRoutes);

app.get("/health", (_req: Request, res: Response) => {
  return res.status(200).json({ status: "ok", service: "billing" });
});

app.listen(PORT, () => {
  connectToDB();
  console.log(`Billing service is running on port ${PORT}`);
});
