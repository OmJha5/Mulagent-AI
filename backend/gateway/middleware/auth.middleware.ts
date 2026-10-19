import { type Request, type Response, type NextFunction } from "express";
import redis from "../../shared/redis/redis.ts";

export interface SessionUser {
  userId: string;
  name: string;
  email: string;
  avatar: string;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sessionId = req.cookies?.session;

    if (!sessionId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No session token provided" });
    }

    const sessionData = await redis.get(`session:${sessionId}`);

    if (!sessionData) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Session expired or invalid" });
    }

    const user: SessionUser = JSON.parse(sessionData);
    req.user = user;

    return next();
  } catch {
    return res
      .status(500)
      .json({ message: "Internal server error during authentication" });
  }
};

export default protect;
