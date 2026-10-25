import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
import cors from "cors";
import cookieParser from "cookie-parser";
import protect from "./middleware/auth.middleware.ts";
import { createAuthenticatedProxy } from "./utils/proxy.ts";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(cookieParser());

const PORT = process.env.PORT || 8000;

// Current user endpoint handled directly at gateway level from session store
app.get("/api/getCurrentUser", protect, (req: Request, res: Response) => {
  return res.status(200).json(req.user);
});

// Chat service with authentication & user header injection
app.use(
  "/api/chat",
  protect,
  createAuthenticatedProxy(process.env.CHAT_SERVICE_URL!),
);

// Other microservices
app.use("/api/auth", proxy(process.env.AUTH_SERVICE_URL!));
app.use(
  "/api/agent",
  protect,
  createAuthenticatedProxy(process.env.AGENT_SERVICE_URL!),
);
app.use(
  "/api/billing",
  protect,
  createAuthenticatedProxy(process.env.BILLING_SERVICE_URL!),
);

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ message: "Gateway is running" });
});

app.listen(PORT, () => {
  console.log(`Gateway is running on port ${PORT}`);
});
