import { randomUUID } from "node:crypto";
import { getLLMModel } from "../config/llmModels.ts";
import { agentLabel, pptConfig } from "../constants/constants.ts";
import { type AgentState } from "../graph/state.ts";
import { getPptPrompt } from "../prompts/ppt.prompts.ts";
import { generatePpt, parsePptData } from "../utils/generatePpt.ts";
import { getFromS3 } from "../utils/getFromS3.ts";
import { extractMessageText } from "../utils/parseGeneratedProject.ts";
import { uploadToS3 } from "../utils/uploadToS3.ts";

export const pptAgent = async (state: AgentState) => {
  const userPrompt = state.prompt?.trim();
  if (!userPrompt) {
    return {
      ...state,
      aiResponse:
        "Please provide a topic or content description for the presentation you want to generate.",
    };
  }

  try {
    const llm = getLLMModel(agentLabel.ppt);
    const res = await llm.invoke(getPptPrompt(userPrompt));

    const rawContent = extractMessageText(res.content);
    const data = parsePptData(rawContent);

    const pptBuffer = await generatePpt(data);

    const filename = `${pptConfig.filePrefix}-${Date.now()}-${randomUUID().slice(0, 8)}.pptx`;
    await uploadToS3(filename, pptBuffer, pptConfig.contentType);

    const downloadUrl = await getFromS3(
      filename,
      pptConfig.signedUrlExpiresInSeconds,
    );
    const expiresInHours = Math.floor(
      pptConfig.signedUrlExpiresInSeconds / 3600,
    );

    return {
      ...state,
      aiResponse: `# ✅ Presentation Generated

**${data.title}**

📥 [Download PPT](${downloadUrl})

_Link expires in ${expiresInHours} ${expiresInHours === 1 ? "hour" : "hours"}._`,
    };
  } catch (error) {
    console.error("Error in ppt agent:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate presentation";

    return {
      ...state,
      aiResponse: `Failed to generate presentation: ${errorMessage}`,
    };
  }
};
