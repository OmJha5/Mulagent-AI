import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import { connectToDB } from "./config/db.ts";
import router from "./routes/agent.routes.ts";

const app = express();

dotenv.config();

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use("/", router);

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ message: "Agent service is running" });
});

app.listen(PORT, () => {
  connectToDB();
  console.log(`Agent service is running on port ${PORT}`);
});
