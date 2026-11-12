import type { EditorProps } from "@monaco-editor/react";
import {
  Code2,
  FileText,
  Globe,
  ImageIcon,
  MessageSquare,
  Presentation,
  Zap,
} from "lucide-react";

export const agents = [
  {
    id: "auto",
    icon: Zap,
    label: "auto",
  },

  {
    id: "chat",
    icon: MessageSquare,
    label: "chat",
  },

  {
    id: "coding",
    icon: Code2,
    label: "coding",
  },

  {
    id: "pdf",
    icon: FileText,
    label: "pdf",
  },

  {
    id: "ppt",
    icon: Presentation,
    label: "ppt",
  },

  {
    id: "vision",
    icon: ImageIcon,
    label: "vision",
  },

  {
    id: "search",
    icon: Globe,
    label: "search",
  },
];

export const agentLabel = {
  auto: "auto",
  chat: "chat",
  coding: "coding",
  pdf: "pdf",
  ppt: "ppt",
  vision: "vision",
  search: "search",
};

export const messageRole = {
  user: "user",
  assistant: "assistant",
} as const;

export type MessageRole = (typeof messageRole)[keyof typeof messageRole];

export const artifactTab = {
  code: "code",
  preview: "preview",
} as const;

export type ArtifactTab = (typeof artifactTab)[keyof typeof artifactTab];

export const artifactPreviewFile = {
  html: "index.html",
  css: "style.css",
  js: "script.js",
} as const;

export const artifactDefaultLanguage = "plaintext";

export const artifactLanguageByExtension: Record<string, string> = {
  ".html": "html",
  ".htm": "html",
  ".css": "css",
  ".scss": "scss",
  ".less": "less",
  ".js": "javascript",
  ".mjs": "javascript",
  ".cjs": "javascript",
  ".jsx": "javascript",
  ".ts": "typescript",
  ".tsx": "typescript",
  ".json": "json",
  ".py": "python",
  ".java": "java",
  ".cpp": "cpp",
  ".cc": "cpp",
  ".c": "c",
  ".h": "c",
  ".md": "markdown",
  ".yml": "yaml",
  ".yaml": "yaml",
  ".xml": "xml",
  ".svg": "xml",
  ".sql": "sql",
  ".sh": "shell",
};

export const artifactCopyResetDelayMs = 2000;

export const artifactPanelSize = {
  expandedWidth: "28rem",
  collapsedWidth: "3rem",
} as const;

export const artifactMotionConfig = {
  panelTransitionDuration: 0.25,
  contentTransitionDuration: 0.25,
} as const;

export const artifactMonacoTheme = "vs-dark" as const;

export const artifactPreviewSandbox = "allow-scripts allow-forms" as const;

export const artifactMonacoOptions: NonNullable<EditorProps["options"]> = {
  readOnly: true,
  minimap: { enabled: false },
  fontSize: 13,
  wordWrap: "on",
  automaticLayout: true,
  scrollBeyondLastLine: false,
  padding: { top: 16, bottom: 16 },
  lineNumbers: "on",
  renderLineHighlight: "none",
  tabSize: 2,
};
