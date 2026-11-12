import {
  artifactDefaultLanguage,
  artifactLanguageByExtension,
  artifactPreviewFile,
} from "@/constants/constants";
import type {
  IArtifact,
  IArtifactFile,
  IMessage,
} from "@/redux/messageSlice";

export const detectLanguage = (fileName = ""): string => {
  const normalized = fileName.trim().toLowerCase();
  const dotIndex = normalized.lastIndexOf(".");
  if (dotIndex === -1) return artifactDefaultLanguage;

  const extension = normalized.slice(dotIndex);
  return artifactLanguageByExtension[extension] ?? artifactDefaultLanguage;
};

export const buildPreviewDocument = (
  files: IArtifactFile[],
): { canPreview: boolean; previewDoc: string } => {
  const htmlFile = files.find((file) => file.name === artifactPreviewFile.html);
  if (!htmlFile) {
    return { canPreview: false, previewDoc: "" };
  }

  const cssFile = files.find((file) => file.name === artifactPreviewFile.css);
  const jsFile = files.find((file) => file.name === artifactPreviewFile.js);

  const previewDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>${cssFile?.content ?? ""}</style>
</head>
<body>
${htmlFile.content ?? ""}
  <script>${jsFile?.content ?? ""}</script>
</body>
</html>`;

  return { canPreview: true, previewDoc };
};

export const getLatestArtifactsFromMessages = (
  messages: IMessage[],
): IArtifact[] => {
  const latestArtifactMessage = [...messages]
    .reverse()
    .find((msg) => Array.isArray(msg.artifacts) && msg.artifacts.length > 0);

  return latestArtifactMessage?.artifacts ?? [];
};
