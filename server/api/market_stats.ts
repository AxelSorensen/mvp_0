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
  
  const instruction = `Given a market, search the web and return only the market size and the source you got the number from.

Market: 
Outdoor Equipment

Output:
json{{
  market_size: {{
    value: US$26bn,
    source:https://www.statista.com/outlook/cmo/toys-hobby/sports-equipment/outdoor-equipment/worldwide
  }},
  CAGR: {{
    value: 5.8%,
    source: https://www.businessresearchinsights.com/market-reports/outdoor-gear-equipment-market-105833
  }}
  }}
`;

const outputParser = new StringOutputParser();

const prompt = ChatPromptTemplate.fromMessages([
  ["system", instruction],
  ["placeholder", "{chat_history}"],
  ["human", "Market: {input}\n\nOutput:\n\n"],
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
      input: body.market
    });
    // console.log(response)
    return outputParser.parse(response.output)
  } catch (error) {
    console.error("Error invoking model:", error);
    return 'Error invoking model'
  }
});