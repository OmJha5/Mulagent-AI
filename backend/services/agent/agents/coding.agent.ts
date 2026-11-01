import { type AgentState } from "../graph/state.ts";

export const codingAgent = async (state: AgentState) => {
  console.log("Coding agent executed : " + state.agent);
};
