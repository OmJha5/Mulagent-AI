import { StateGraph, START, END } from "@langchain/langgraph";
import { agentState } from "./state.ts";
import { router } from "./router.ts";
import { chatAgent } from "../agents/chat.agent.ts";
import { searchAgent } from "../agents/search.agent.ts";
import { pdfAgent } from "../agents/pdf.agent.ts";
import { pptAgent } from "../agents/ppt.agent.ts";
import { visionAgent } from "../agents/vision.agent.ts";
import { codingAgent } from "../agents/coding.agent.ts";

export const workFlow = new StateGraph(agentState)
  .addNode("router", router)
  .addNode("chat", chatAgent)
  .addNode("search", searchAgent)
  .addNode("coding", codingAgent)
  .addNode("pdf", pdfAgent)
  .addNode("ppt", pptAgent)
  .addNode("vision", visionAgent)

  .addEdge(START, "router")

  .addConditionalEdges(
    "router",
    (state) => {
      switch (state.agent) {
        case "chat":
          return "chat";
        case "search":
          return "search";
        case "coding":
          return "coding";
        case "pdf":
          return "pdf";
        case "ppt":
          return "ppt";
        case "vision":
          return "vision";
        default:
          return "chat";
      }
    },
    {
      chat: "chat",
      search: "search",
      coding: "coding",
      pdf: "pdf",
      ppt: "ppt",
      vision: "vision",
    },
  )

  .addEdge("search", "chat")
  .addEdge("coding", END)
  .addEdge("pdf", END)
  .addEdge("ppt", END)
  .addEdge("vision", END)
  .addEdge("chat", END);

export const graph = workFlow.compile();
