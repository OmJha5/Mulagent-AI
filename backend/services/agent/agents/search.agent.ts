import { searchTool } from "../config/tavily.ts";
import { type AgentState } from "../graph/state.ts";

export const searchAgent = async (state: AgentState) => {
  try {
    const results = await searchTool.invoke({
      query: state.prompt,
    });

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
