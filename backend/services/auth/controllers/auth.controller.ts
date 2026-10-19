import { getAuth } from "firebase-admin/auth";
import { app } from "../config/firebase.ts";
import { type Request, type Response } from "express";
import { User } from "../models/user.model.ts";
import redis from "../../../shared/redis/redis.ts";

export const login = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const decoded = await getAuth(app).verifyIdToken(token);

    let user = await User.findOne({
      firebaseUid: decoded.uid,
    });

    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        name: decoded.name,
        email: decoded.email,
        avatar: decoded.picture,
      });
    }

    const sessionId = crypto.randomUUID();
    await redis.set(
      `session:${sessionId}`,
      JSON.stringify({
        userId: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      }),
      "EX",
      7 * 24 * 60 * 60,
    );

    res.cookie("session", sessionId, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ message: "Error in login", error });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const sessionId = req.cookies.session;
    if (!sessionId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await redis.del(`session:${sessionId}`);
    res.clearCookie("session");
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error in logout", error });
  }
};