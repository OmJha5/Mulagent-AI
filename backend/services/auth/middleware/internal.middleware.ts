import { type Request, type Response, type NextFunction } from "express";
import crypto from "crypto";
import { authConfig } from "../constants/constants.ts";

export const verifyInternalService = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const incomingSecret = req.headers[authConfig.internalSecretHeader];
  const expectedSecret = process.env.INTERNAL_SERVICE_SECRET;

  if (
    !expectedSecret ||
    typeof incomingSecret !== "string" ||
    incomingSecret.length !== expectedSecret.length ||
    !crypto.timingSafeEqual(
      // It compares every single byte from start to finish, even if the very first character was completely wrong.
      Buffer.from(incomingSecret),
      Buffer.from(expectedSecret),
    )
  ) {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Invalid or missing internal service secret.",
    });
  }

  return next();
};
