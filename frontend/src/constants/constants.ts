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
