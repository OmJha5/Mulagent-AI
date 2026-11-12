import { getLLMModel } from "../config/llmModels.ts";
import {
  agentLabel,
  artifactType,
  codingIntent,
} from "../constants/constants.ts";
import { type AgentState } from "../graph/state.ts";
import {
  getCodeGenerationPrompt,
  getCodingIntentPrompt,
  getCodingMarkdownPrompt,
} from "../prompts/coding.prompts.ts";
import {
  extractMessageText,
  parseGeneratedProject,
} from "../utils/parseGeneratedProject.ts";

export const codingAgent = async (state: AgentState) => {
  try {
    const intentLlm = getLLMModel(agentLabel.intent);
    const llm = getLLMModel(agentLabel.coding);

    const intentRes = await intentLlm.invoke(
      getCodingIntentPrompt(state.prompt),
    );
    const intent = extractMessageText(intentRes.content).trim().toUpperCase();

    if (intent === codingIntent.codeGeneration) {
      const res = await llm.invoke(getCodeGenerationPrompt(state.prompt));
      const rawContent = extractMessageText(res.content);
      const data = parseGeneratedProject(rawContent);

      return {
        ...state,
        aiResponse: "Code Generated Successfully.",
        artifacts: [
          {
            id: Date.now(),
            type: artifactType.project,
            files: data.files,
            title: state.prompt,
          },
        ],
      };
    }

    const res = await llm.invoke(getCodingMarkdownPrompt(intent, state.prompt));
    const data = extractMessageText(res.content);

    return {
      ...state,
      aiResponse: data,
      artifacts: [],
    };
  } catch (error) {
    console.error("Error in coding agent:", error);
    const errorMessage =
      (error as { data?: { message?: string } })?.data?.message ||
      (error instanceof Error ? error.message : "Failed to generate code");

    return {
      ...state,
      aiResponse: errorMessage,
      artifacts: [],
    };
  }
};
