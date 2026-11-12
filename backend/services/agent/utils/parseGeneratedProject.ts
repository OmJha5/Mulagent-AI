import { type IArtifactFile } from "../graph/state.ts";

export const extractMessageText = (content: unknown): string => {
  if (typeof content === "string") {
    return content;
  }
  return JSON.stringify(content || "");
};

const normalizeFiles = (files: unknown): IArtifactFile[] => {
  if (!Array.isArray(files)) return [];
  return files
    .filter(
      (file): file is { name: unknown; content: unknown } =>
        Boolean(file) && typeof file === "object" && "name" in file,
    )
    .map((file) => ({
      name: String(file.name ?? ""),
      content: String(file.content ?? ""),
    }))
    .filter((file) => file.name.length > 0);
};

export const parseGeneratedProject = (
  rawContent: string,
): { files: IArtifactFile[] } => {
  const cleaned = rawContent
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned) as { files?: unknown };
    return {
      files: normalizeFiles(parsed.files),
    };
  } catch {
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      const sliced = cleaned.slice(firstBrace, lastBrace + 1);
      const parsed = JSON.parse(sliced) as { files?: unknown };
      return {
        files: normalizeFiles(parsed.files),
      };
    }
    throw new Error("Invalid JSON output from coding model");
  }
};

