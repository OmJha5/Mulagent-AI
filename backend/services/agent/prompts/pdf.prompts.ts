export const getPdfPrompt = (userPrompt: string): string => `
You are an expert document writer and formatter.

Convert the user's topic into a structured, highly informative document.

Return ONLY a valid JSON object matching this exact structure:
{
  "title": "Document Title",
  "subtitle": "A concise subtitle or summary",
  "sections": [
    {
      "heading": "Section Heading",
      "points": [
        "First key point with detailed explanation",
        "Second key point with relevant context",
        "Third key point with practical insight"
      ]
    }
  ]
}

Requirements:
- Generate 4 to 8 comprehensive sections.
- Each section must have 3 to 6 clear, informative, and detailed bullet points.
- Ensure the title is professional, clear, and relevant.
- Subtitle should capture the core theme of the document.

Rules:
- Return ONLY valid JSON.
- Output must start with { and end with }.
- Do NOT wrap in markdown code blocks like \`\`\`json.
- Do NOT include any explanations, introduction, or text outside the JSON.

Topic:
${userPrompt}
`;
