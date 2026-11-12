import { Annotation } from "@langchain/langgraph";

export interface IArtifactFile {
  name: string;
  content: string;
}

export interface IArtifact {
  id: number;
  type: string;
  title: string;
  files: IArtifactFile[];
}

export const agentState = Annotation.Root({
  prompt: Annotation<string>(),
  aiResponse: Annotation<string>(),
  agent: Annotation<string>(),
  conversationId: Annotation<string>(),
  userId: Annotation<string>(),
  searchResults: Annotation<string[]>(),
  searchImages: Annotation<string[]>(),
  artifacts: Annotation<IArtifact[]>(),
});

export type AgentState = typeof agentState.State;
