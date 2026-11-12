import { randomUUID } from "node:crypto";
import "dotenv/config";
import axios from "axios";
import { getLLMModel } from "../config/llmModels.ts";
import { agentLabel, visionConfig } from "../constants/constants.ts";
import { type AgentState } from "../graph/state.ts";
import { getVisionPrompt } from "../prompts/vision.prompts.ts";
import { getFromS3 } from "../utils/getFromS3.ts";
import { extractMessageText } from "../utils/parseGeneratedProject.ts";
import { uploadToS3 } from "../utils/uploadToS3.ts";

const getImageExtension = (contentType: string): string => {
  if (contentType.includes("jpeg") || contentType.includes("jpg")) return "jpg";
  if (contentType.includes("webp")) return "webp";
  return "png";
};

export const visionAgent = async (state: AgentState) => {
  const userPrompt = state.prompt?.trim();
  if (!userPrompt) {
    return {
      ...state,
      aiResponse:
        "Please provide a description of the image you want to generate.",
    };
  }

  try {
    const apiKey = process.env.POLLINATIONS_API_KEY?.trim();
    if (!apiKey) {
      throw new Error("Missing POLLINATIONS_API_KEY environment variable.");
    }

    const llm = getLLMModel(agentLabel.vision);
    const res = await llm.invoke(getVisionPrompt(userPrompt));

    const enhancedPrompt =
      extractMessageText(res.content)
        .trim()
        .replace(/^["']|["']$/g, "") || userPrompt;

    const imageUrl = `${visionConfig.pollinationsBaseUrl}/${encodeURIComponent(enhancedPrompt)}`;

    const imageRes = await axios.get<ArrayBuffer>(imageUrl, {
      responseType: "arraybuffer",
      timeout: visionConfig.imageRequestTimeoutMs,
      params: {
        model: visionConfig.pollinationsModel,
      },
      headers: {
        Accept: "image/*", // It tells the pollinations server that we accept any image format
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const rawContentType = String(
      imageRes.headers["content-type"] || "image/png",
    )
      .split(";")[0]
      .trim()
      .toLowerCase();

    if (!rawContentType.startsWith("image/")) {
      throw new Error(
        `Image service returned unexpected content type: ${rawContentType}`,
      );
    }

    const buffer = Buffer.from(imageRes.data);
    if (buffer.length === 0) {
      throw new Error("Image service returned an empty response.");
    }

    const ext = getImageExtension(rawContentType);
    const filename = `vision/image-${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;

    await uploadToS3(filename, buffer, rawContentType);

    const downloadUrl = await getFromS3(
      filename,
      visionConfig.signedUrlExpiresInMinutes,
    );
    const expiresInHours = Math.floor(
      visionConfig.signedUrlExpiresInMinutes / 60,
    );

    return {
      ...state,
      aiResponse: `![Generated Image](${downloadUrl})

📥 [Download Image](${downloadUrl})

⏳ Link expires in ${expiresInHours} ${expiresInHours === 1 ? "Hour" : "Hours"}.`,
    };
  } catch (error) {
    console.error("Error in vision agent:", error);

    const errorMessage = axios.isAxiosError(error)
      ? error.response?.statusText || error.message
      : error instanceof Error
        ? error.message
        : "Failed to generate image";

    return {
      ...state,
      aiResponse: `Failed to generate image: ${errorMessage}`,
    };
  }
};
