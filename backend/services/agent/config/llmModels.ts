import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { ChatOpenRouter } from "@langchain/openrouter";

const groqModel = new ChatGroq({
  model: "openai/gpt-oss-120b",
});

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-pro",
});

const openrouter = new ChatOpenRouter({
  model: "deepseek/deepseek-chat",
  temperature: 0,
  maxTokens: 2500,
});

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
