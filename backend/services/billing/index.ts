import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import { connectToDB } from "./config/db.ts";

const app = express();

dotenv.config();

const PORT = process.env.PORT || 8000;

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ message: "Billing service is running" });
});

app.listen(PORT, () => {
  connectToDB();
  console.log(`Billing service is running on port ${PORT}`);
});

