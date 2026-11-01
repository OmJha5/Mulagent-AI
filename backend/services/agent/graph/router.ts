import { getLLMModel } from "../config/llmModels.ts";
import { agentLabel } from "../constants/constants.ts";
import { type AgentState } from "./state.ts";

export const router = async (state: AgentState) => {
  // if agent is already selected, return it
  if (state.agent && state.agent !== agentLabel.auto) {
    return {
      ...state,
      agent: state.agent,
    };
  }

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

  return {
    ...state,
    agent: response.content.toString().trim().toLowerCase(),
  };
};
