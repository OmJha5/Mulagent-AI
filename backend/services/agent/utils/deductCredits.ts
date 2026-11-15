import axios from "axios";
import "dotenv/config";
import redis from "../../../shared/redis/redis.ts";
import {
  agentCreditCosts,
  type AgentType,
  internalServiceConfig,
} from "../constants/constants.ts";

export interface IDeductCreditsResponse {
  success: boolean;
  deductedCredits?: number;
  remainingCredits?: number;
  message?: string;
}

export interface ICheckCreditsResponse {
  hasEnough: boolean;
  cost: number;
  credits: number;
  message?: string;
}

const getRedisUserCredits = async (userId: string): Promise<number | null> => {
  try {
    const sessionId = await redis.get(`user-session:${userId}`);
    if (!sessionId) return null;

    const sessionStr = await redis.get(`session:${sessionId}`);
    if (!sessionStr) return null;

    const session = JSON.parse(sessionStr) as { credits?: number };
    return typeof session.credits === "number" ? session.credits : null;
  } catch {
    return null;
  }
};

export const checkUserCredits = async (
  userId: string,
  agent: string,
): Promise<ICheckCreditsResponse> => {
  const authServiceUrl = process.env.AUTH_SERVICE_URL;
  if (!authServiceUrl || !userId) {
    return { hasEnough: true, cost: 0, credits: 0 };
  }

  const cost = agentCreditCosts[agent as AgentType] ?? 1;

  // 1. Fast-path: Check Redis session directly (<1ms, no HTTP overhead)
  const redisCredits = await getRedisUserCredits(userId);
  if (redisCredits !== null) {
    const hasEnough = redisCredits >= cost;
    return {
      hasEnough,
      cost,
      credits: redisCredits,
      message: hasEnough
        ? undefined
        : `Not enough credits. Required: ${cost}, available: ${redisCredits}.`,
    };
  }

  // 2. Fallback: Check auth service internal endpoint
  try {
    const response = await axios.post<{
      success: boolean;
      hasEnough: boolean;
      cost: number;
      credits: number;
      message?: string;
    }>(
      `${authServiceUrl}/check-credits`,
      { userId, agent },
      {
        headers: {
          [internalServiceConfig.internalSecretHeader]:
            process.env.INTERNAL_SERVICE_SECRET || "",
        },
      },
    );
    return {
      hasEnough: response.data.hasEnough,
      cost: response.data.cost,
      credits: response.data.credits,
      message: response.data.message,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      return {
        hasEnough: false,
        cost,
        credits: 0,
        message: String(error.response.data.message),
      };
    }
    return { hasEnough: true, cost, credits: cost };
  }
};

export const deductCredits = async (
  userId: string,
  agent: string,
): Promise<IDeductCreditsResponse> => {
  const authServiceUrl = process.env.AUTH_SERVICE_URL;
  if (!authServiceUrl) {
    return { success: true };
  }

  if (!userId) {
    return { success: true };
  }

  try {
    const response = await axios.post<IDeductCreditsResponse>(
      `${authServiceUrl}/deduct-credits`,
      { userId, agent },
      {
        headers: {
          [internalServiceConfig.internalSecretHeader]:
            process.env.INTERNAL_SERVICE_SECRET || "",
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(String(error.response.data.message), { cause: error });
    }
    throw error;
  }
};
