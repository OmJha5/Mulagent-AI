import { randomUUID } from "node:crypto";
import { getLLMModel } from "../config/llmModels.ts";
import { agentLabel, pdfConfig } from "../constants/constants.ts";
import { type AgentState } from "../graph/state.ts";
import { getPdfPrompt } from "../prompts/pdf.prompts.ts";
import { generatePdf, parsePdfData } from "../utils/generatePdf.ts";
import { getFromS3 } from "../utils/getFromS3.ts";
import { extractMessageText } from "../utils/parseGeneratedProject.ts";
import { uploadToS3 } from "../utils/uploadToS3.ts";

export const pdfAgent = async (state: AgentState) => {
  const userPrompt = state.prompt?.trim();
  if (!userPrompt) {
    return {
      ...state,
      aiResponse:
        "Please provide a topic or content description for the PDF you want to generate.",
    };
  }

  try {
    const llm = getLLMModel(agentLabel.pdf);
    const res = await llm.invoke(getPdfPrompt(userPrompt));

    const rawContent = extractMessageText(res.content);
    const data = parsePdfData(rawContent);

    const pdfBuffer = await generatePdf(data);

    const filename = `${pdfConfig.filePrefix}-${Date.now()}-${randomUUID().slice(0, 8)}.pdf`;
    await uploadToS3(filename, pdfBuffer, pdfConfig.contentType);

    const downloadUrl = await getFromS3(
      filename,
      pdfConfig.signedUrlExpiresInSeconds,
    );
    const expiresInHours = Math.floor(
      pdfConfig.signedUrlExpiresInSeconds / 3600,
    );

    return {
      ...state,
      aiResponse: `# PDF Generated

**${data.title}**

📥 [Download PDF](${downloadUrl})

_Link expires in ${expiresInHours} ${expiresInHours === 1 ? "hour" : "hours"}._`,
    };
  } catch (error) {
    console.error("Error in pdf agent:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate pdf";

    return {
      ...state,
      aiResponse: `Failed to generate PDF: ${errorMessage}`,
    };
  }
};
