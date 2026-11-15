import { getAuth } from "firebase-admin/auth";
import { type Request, type Response } from "express";
import { app } from "../config/firebase.ts";
import {
  authConfig,
  agentCreditCosts,
  type AgentType,
} from "../constants/constants.ts";
import { User } from "../models/user.model.ts";
import {
  deductCreditsSchema,
  updatePaymentSchema,
} from "../validators/auth.validator.ts";
import redis from "../../../shared/redis/redis.ts";

export const login = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: "Missing token" });
    }

    const decoded = await getAuth(app).verifyIdToken(token);

    let user = await User.findOne({
      firebaseUid: decoded.uid,
    });

    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        name: decoded.name,
        email: decoded.email || "",
        avatar: decoded.picture || "",
        plan: authConfig.defaultPlan,
        credits: authConfig.defaultCredits,
        totalCredits: authConfig.defaultCredits,
      });
    }

    const sessionId = crypto.randomUUID();
    const sessionUser = {
      userId: String(user._id),
      name: user.name,
      email: user.email,
      avatar: user.avatar ?? "",
      plan: user.plan,
      credits: user.credits,
      totalCredits: user.totalCredits,
      planExpiresAt: user.planExpiresAt ?? null,
    };

    // Store mapping from userId to active sessionId for cross-service updates
    await redis.set(
      `user-session:${user._id}`,
      sessionId,
      "EX",
      authConfig.sessionTtlSeconds,
    );

    // Store active session payload
    await redis.set(
      `session:${sessionId}`,
      JSON.stringify(sessionUser),
      "EX",
      authConfig.sessionTtlSeconds,
    );

    res.cookie("session", sessionId, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: authConfig.sessionCookieMaxAgeMs,
    });

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error in login:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error in login", error });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const sessionId = req.cookies?.session;
    if (!sessionId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const sessionData = await redis.get(`session:${sessionId}`);
    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData) as { userId?: string };
        if (parsed.userId) {
          await redis.del(`user-session:${parsed.userId}`);
        }
      } catch {
        // ignore parse error
      }
    }

    await redis.del(`session:${sessionId}`);
    res.clearCookie("session");
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error in logout", error });
  }
};

export const updateUserPlan = async (req: Request, res: Response) => {
  try {
    const validation = updatePaymentSchema.safeParse(req.body);
    if (!validation.success) {
      const issue = validation.error.issues[0];
      return res.status(400).json({
        success: false,
        message: issue?.message || "Invalid update payment request payload",
      });
    }

    const { userId, plan, credits } = validation.data;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.plan = plan;
    user.credits = user.credits + credits;
    user.totalCredits = user.totalCredits + credits;
    user.planExpiresAt = new Date(
      Date.now() + authConfig.planValidityDays * 24 * 60 * 60 * 1000,
    );
    await user.save();

    // Update active Redis session if the user is currently logged in
    const sessionId = await redis.get(`user-session:${user._id}`);
    if (sessionId) {
      const existingSessionStr = await redis.get(`session:${sessionId}`);
      if (existingSessionStr) {
        const existingSession = JSON.parse(existingSessionStr);
        const updatedSession = {
          ...existingSession,
          plan: user.plan,
          credits: user.credits,
          totalCredits: user.totalCredits,
          planExpiresAt: user.planExpiresAt ?? null,
        };

        await redis.set(
          `session:${sessionId}`,
          JSON.stringify(updatedSession),
          "EX",
          authConfig.sessionTtlSeconds,
        );
      }
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error in updateUserPayment:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error updating user payment", error });
  }
};

export const deductCredits = async (req: Request, res: Response) => {
  try {
    const validation = deductCreditsSchema.safeParse(req.body);
    if (!validation.success) {
      const issue = validation.error.issues[0];
      return res.status(400).json({
        success: false,
        message: issue?.message || "Invalid deduct credits request payload",
      });
    }

    const { userId, agent } = validation.data;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const cost = agentCreditCosts[agent as AgentType] ?? 1;
    if (user.credits < cost) {
      return res.status(400).json({
        success: false,
        message: `Not enough credits. Required: ${cost}, available: ${user.credits}.`,
      });
    }

    user.credits -= cost;
    await user.save();

    // Update active Redis session with latest credits if logged in
    const sessionId = await redis.get(`user-session:${user._id}`);
    if (sessionId) {
      const existingSessionStr = await redis.get(`session:${sessionId}`);
      if (existingSessionStr) {
        const existingSession = JSON.parse(existingSessionStr);
        const updatedSession = {
          ...existingSession,
          credits: user.credits,
        };

        await redis.set(
          `session:${sessionId}`,
          JSON.stringify(updatedSession),
          "EX",
          authConfig.sessionTtlSeconds,
        );
      }
    }

    return res.status(200).json({
      success: true,
      deductedCredits: cost,
      remainingCredits: user.credits,
    });
  } catch (error) {
    console.error("Error in deductCredits:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error deducting credits", error });
  }
};

export const checkCredits = async (req: Request, res: Response) => {
  try {
    const validation = deductCreditsSchema.safeParse(req.body);
    if (!validation.success) {
      const issue = validation.error.issues[0];
      return res.status(400).json({
        success: false,
        message: issue?.message || "Invalid check credits request payload",
      });
    }

    const { userId, agent } = validation.data;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const cost = agentCreditCosts[agent as AgentType] ?? 1;
    const hasEnough = user.credits >= cost;

    return res.status(200).json({
      success: true,
      hasEnough,
      cost,
      credits: user.credits,
      message: hasEnough
        ? undefined
        : `Not enough credits. Required: ${cost}, available: ${user.credits}.`,
    });
  } catch (error) {
    console.error("Error in checkCredits:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error checking credits", error });
  }
};
