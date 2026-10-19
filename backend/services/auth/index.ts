import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectToDB } from "./config/db.ts";
import router from "./routes/auth.route.ts";

const app = express();

dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use("/", router);

const PORT = process.env.PORT || 8001;

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ message: "Auth service is running" });
});

app.listen(PORT, () => {
  connectToDB();
  console.log(`Auth service is running on port ${PORT}`);
});
