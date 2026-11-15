import { searchTool } from "../config/tavily.ts";
import { agentLabel } from "../constants/constants.ts";
import { type AgentState } from "../graph/state.ts";
import { deductCredits } from "../utils/deductCredits.ts";

export const searchAgent = async (state: AgentState) => {
  try {
    const results = await searchTool.invoke({
      query: state.prompt,
    });

    // Deduct credits ONLY after search succeeded!
    await deductCredits(state.userId, agentLabel.search);

    return {
      ...state,
      searchResults: results.results,
      searchImages: results.images,
    };
  } catch (error) {
    console.error("Error in search agent", error);
    return {
      ...state,
      searchResults: [],
      searchImages: [],
    };
  }
};
