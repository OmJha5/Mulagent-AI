import { getCodingLLMModel, getLLMModel } from "../config/llmModels.ts";
import {
  agentLabel,
  artifactType,
  codingIntent,
  codingJsonResponseFormat,
} from "../constants/constants.ts";
import { type AgentState, type IArtifactFile } from "../graph/state.ts";
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

    const intentRes = await intentLlm.invoke(
      getCodingIntentPrompt(state.prompt),
    );
    const intent = extractMessageText(intentRes.content).trim().toUpperCase();

    if (intent === codingIntent.codeGeneration) {
      const codingLlm = getCodingLLMModel();
      const res = await codingLlm.invoke(
        getCodeGenerationPrompt(state.prompt),
        {
          response_format: codingJsonResponseFormat,
        },
      );
      const rawContent = extractMessageText(res.content);
      const finishReason = (
        res.response_metadata as { finish_reason?: string } | undefined
      )?.finish_reason;

      let data: { files: IArtifactFile[] };
      try {
        data = parseGeneratedProject(rawContent);
      } catch (parseError) {
        if (finishReason === "length") {
          console.error(
            "Coding agent output truncated due to token limit. Content length:",
            rawContent.length,
          );
          throw new Error(
            "Generated project exceeded the output token limit and was truncated. Try requesting a simpler project.",
            { cause: parseError },
          );
        }
        throw parseError;
      }

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

    const llm = getLLMModel(agentLabel.coding);
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
