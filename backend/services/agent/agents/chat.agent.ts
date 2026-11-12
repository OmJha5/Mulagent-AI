import type { BaseMessage } from "@langchain/core/messages";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { getLLMModel } from "../config/llmModels.ts";
import { getConversationMemory } from "../config/memory.ts";
import { agentLabel } from "../constants/constants.ts";
import { type AgentState } from "../graph/state.ts";
import { getChatSystemPrompt } from "../prompts/chat.prompts.ts";
import { extractMessageText } from "../utils/parseGeneratedProject.ts";

export interface IMessage {
  role: "user" | "assistant";
  content: string;
}

export const chatAgent = async (state: AgentState) => {
  const userPrompt = state.prompt?.trim();
  if (!userPrompt) {
    return {
      ...state,
      aiResponse: "Please provide a message to continue.",
    };
  }

  try {
    const llm = getLLMModel(agentLabel.chat);
    const systemPrompt = getChatSystemPrompt(state.searchResults);

    const history: BaseMessage[] = [new SystemMessage(systemPrompt)];

    const messages = await getConversationMemory(
      state.conversationId,
      state.userId,
    );

    if (Array.isArray(messages)) {
      messages.forEach((message: IMessage) => {
        if (
          !message ||
          typeof message.content !== "string" ||
          !message.content.trim()
        ) {
          return;
        }
        if (message.role === "user") {
          history.push(new HumanMessage(message.content));
        } else if (message.role === "assistant") {
          history.push(new AIMessage(message.content));
        }
      });
    }

    history.push(new HumanMessage(userPrompt));

    const response = await llm.invoke(history);

    return {
      ...state,
      aiResponse: extractMessageText(response.content),
    };
  } catch (error) {
    console.error("Error in chat agent:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate response";

    return {
      ...state,
      aiResponse: `Failed to generate response: ${errorMessage}`,
    };
  }
};
