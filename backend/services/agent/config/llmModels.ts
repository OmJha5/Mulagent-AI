import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { ChatOpenRouter } from "@langchain/openrouter";
import { codingLlmConfig } from "../constants/constants.ts";

const groqModel = new ChatGroq({
  model: "openai/gpt-oss-120b",
});

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-pro",
});

const openrouter = new ChatOpenRouter({
  model: codingLlmConfig.model,
  temperature: codingLlmConfig.temperature,
  maxTokens: codingLlmConfig.maxTokens,
});

export const getCodingLLMModel = (): ChatOpenRouter => openrouter;

export const getLLMModel = (agent: string) => {
  switch (agent) {
    case "coding":
      return openrouter;
    case "imageAnalyzer":
      return geminiModel;
    default:
      return groqModel;
  }
};
