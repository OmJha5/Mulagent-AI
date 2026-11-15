import express from "express";
import {
  checkCredits,
  deductCredits,
  login,
  logout,
  updateUserPlan,
} from "../controllers/auth.controller.ts";
import { verifyInternalService } from "../middleware/internal.middleware.ts";

const router = express.Router();

router.post("/login", login);
router.get("/logout", logout);
router.post("/update-plan", verifyInternalService, updateUserPlan);
router.post("/check-credits", verifyInternalService, checkCredits);
router.post("/deduct-credits", verifyInternalService, deductCredits);

export default router;
