import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";

const groqModel = new ChatGroq({
  model: "openai/gpt-oss-120b",
});

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-pro",
});

export const getLLMModel = (agent: string) => {
  switch (agent) {
    case "coding":
      return geminiModel;
    default:
      return groqModel;
  }
};
