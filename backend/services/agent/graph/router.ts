import { getLLMModel } from "../config/llmModels.ts";
import { agentLabel } from "../constants/constants.ts";
import { checkUserCredits } from "../utils/deductCredits.ts";
import { type AgentState } from "./state.ts";

const validAgents = new Set<string>([
  agentLabel.chat,
  agentLabel.search,
  agentLabel.coding,
  agentLabel.pdf,
  agentLabel.ppt,
  agentLabel.vision,
]);

export const router = async (state: AgentState) => {
  try {
    let resolvedAgent = state.agent;

    // If agent is not selected or is set to auto, predict with router LLM
    if (!resolvedAgent || resolvedAgent === agentLabel.auto) {
      const llm = getLLMModel("router");
      const prompt = `You are an agent router.

    Available agents:

    - chat
    - search
    - coding
    - pdf
    - ppt
    - vision 

    Rules:

    chat:
    General conversation,
    explanations,
    learning,
    questions.

    search:
    Current events,
    latest information,
    news,
    recent developments,
    internet lookup.

    coding:
    Generate code,
    debug code,
    build projects,
    architecture,
    API design.

    pdf:
    Questions about generate PDFs
    or document context.

    ppt:
    Questions about generate ppts
    or ppt context.

    vision:
    Generate image,
    create image

    Return ONLY one word:

    chat
    search
    coding
    pdf
    ppt
    vision

    User Query:
    ${state.prompt}
`;

      const response = await llm.invoke(prompt);
      const predicted = response.content.toString().trim().toLowerCase();
      resolvedAgent = validAgents.has(predicted) ? predicted : agentLabel.chat;
    }

    // Fail-fast credit check on the properly resolved agent
    const creditCheck = await checkUserCredits(state.userId, resolvedAgent);
    if (!creditCheck.hasEnough) {
      throw new Error(
        creditCheck.message ||
          `Not enough credits to use the ${resolvedAgent} agent. Required: ${creditCheck.cost}, available: ${creditCheck.credits}.`,
      );
    }

    return {
      ...state,
      agent: resolvedAgent,
    };
  } catch (error) {
    console.error("Error in router agent:", error);
    throw error;
  }
};
