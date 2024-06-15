// Import env variables
import * as dotenv from 'dotenv'
dotenv.config(({path : '../.env'}))

import { ExaSearchResults } from "@langchain/exa";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import Exa from "exa-js";
import { pull } from "langchain/hub";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
import { JsonOutputParser, StringOutputParser } from "@langchain/core/output_parsers"

async function createAgent() {
  const tools = [
    new ExaSearchResults({
      searchArgs: {
        numResults: 5,
      
        text: {
          maxCharacters: 100,  // Max characters for text content scraped from each page (tradeoff between finding right answer and using many tokens)
          includeHtmlTags: false, 
        },
      },
      client: new Exa(process.env.EXASEARCH_API_KEY),
    }),
  ];
  
const instruction = `Given a market and a description of an idea, search the web and return the names of the top 3 biggest companies in that field.

Market:  Outdoor recreation equipment
Description: A modular, customizable solar-powered battery pack system designed for outdoor enthusiasts. This system allows users to connect multiple battery packs together to increase capacity as needed. Each battery pack module is equipped with high-efficiency solar panels, fast-charging capabilities, and a robust, water-resistant design. The system also includes a smart management unit that optimizes charging and discharging rates, monitors the health of each module, and provides real-time data to a connected mobile app.

Output:
json{{
  "top_3": [
    {{
      "name": "EcoFlow",
      "link": "https://www.ecoflow.com"
    }},
    {{
      "name": "BLUETTI",
      "link": "https://www.bluettipower.com/products/bluetti-ac300-b300-modular-power-system"
    }},
    {{
      "name": "Goal Zero",
      "link": "https://www.goalzero.com/shop/yeti-power-stations"
    }}
  ]
}}
`;

const prompt = ChatPromptTemplate.fromMessages([
  ["system", instruction],
  ["placeholder", "{chat_history}"],
  ["human", "Market: {market}\nDescription: {description}\n\nOutput:\n\n"],
  ["placeholder", "{agent_scratchpad}"],
]);

// const prompt = await pull(
//   "hwchase17/openai-functions-agent"
// );

const llm = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0.2,
  modelKwargs: {
    "response_format": { 
      type: "json_object" 
    }
  }
  
});

const agent = await createOpenAIToolsAgent({
  llm,
  tools,
  prompt,
});

const agentExecutor = new AgentExecutor({
  agent,
  tools,
  returnIntermediateSteps: false,
  verbose: false,
})
  return agentExecutor
}
// Define the tools the agent will have access to.

const outputParser = new JsonOutputParser();


export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const agentExecutor = await createAgent()
  try {
    const response = await agentExecutor.invoke({
      market: body.market,
      description: body.description
    });
    // console.log(response)
    return outputParser.parse(response.output)
  } catch (error) {
    console.error("Error invoking model:", error);
    return 'Error invoking model'
  }
});