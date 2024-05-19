
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser, StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatOpenAI({model:'gpt-4o'
, maxTokens: 100, temperature: 0.2, modelKwargs: {
  "response_format": { 
    type: "json_object" 
  }}});

const instruction = `Given a market and a short description of an idea, return the top-3 potential customer groups in json format:

Market: Outdoor Recreation Equipment
Idea: EcoCharge is a portable, solar-powered battery pack for outdoor enthusiasts, offering high-capacity storage, fast charging, and a durable, water-resistant design.

Output:
json{{
  "top_3": [
    {{
      "name": "Hikers and Backpackers"
    }},
    {{
      "name": "Campers"
    }},
    {{
      "name": "Outdoor Sports Enthusiasts"
    }}
  ]
}}
`;


const prompt = ChatPromptTemplate.fromMessages([
  ["system", instruction],
  ["user", "Market: {market}\nIdea: {idea}\n\nOutput: "],
]);

const outputParser = new JsonOutputParser();

const llmChain = prompt.pipe(llm).pipe(outputParser);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    const output = await llmChain.invoke({
      market: body.market,
      idea: body.idea
    });
    return output;
  } catch (error) {
    console.error("Error invoking model:", error);
    return 'Error invoking model'
  }
});