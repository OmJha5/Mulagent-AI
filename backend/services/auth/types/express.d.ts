import { type SessionUser } from "../middleware/auth.middleware.ts";

declare global {
  namespace Express {
    interface Request {
      user?: SessionUser;
    }
  }
}
