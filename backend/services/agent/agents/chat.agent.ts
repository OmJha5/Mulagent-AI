import type { BaseMessage } from "@langchain/core/messages";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { getLLMModel } from "../config/llmModels.ts";
import { type AgentState } from "../graph/state.ts";
import { getConversationMemory } from "../config/memory.ts";

export interface IMessage {
  role: "user" | "assistant";
  content: string;
}

export const chatAgent = async (state: AgentState) => {
  const llm = getLLMModel("chat");

  const systemPrompt = `
    You are a helpful AI assistant.
    Rules:

- For simple questions, greetings, and short queries, respond naturally in plain text.
- For technical, educational, coding, or detailed topics, use clean Markdown.


 Formatting:

- Use # for titles and ## for sections.
- Leave a blank line after headings.
- Use bullet points for lists.
- Use numbered lists for steps.
- Use fenced code blocks with language tags for code.
- Keep paragraphs short and readable.
- Never write headings and content on the same line.
- Never generate large walls of text.`;

  const history: BaseMessage[] = [new SystemMessage(systemPrompt)];

  const messages = await getConversationMemory(
    state.conversationId,
    state.userId,
  );

  messages.forEach((message: IMessage) => {
    if (message.role === "user") {
      history.push(new HumanMessage(message.content));
    } else {
      history.push(new AIMessage(message.content));
    }
  });

  history.push(new HumanMessage(state.prompt));

  const response = await llm.invoke(history);

  return {
    ...state,
    aiResponse: response.content,
  };
};
