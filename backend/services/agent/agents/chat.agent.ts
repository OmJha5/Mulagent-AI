import { getLLMModel } from "../config/llmModels.ts";
import { type AgentState } from "../graph/state.ts";

export const chatAgent = async (state: AgentState) => {
  const llm = getLLMModel("chat");

  const systemPrompt = `
    You are a helpful AI assistant.`;

  const response = await llm.invoke([
    { role: "user", content: state.prompt },
    { role: "system", content: systemPrompt },
  ]);

  return {
    ...state,
    aiResponse: response.content,
  };
};
