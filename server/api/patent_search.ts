// Import env variables
import * as dotenv from 'dotenv'
dotenv.config(({path : '../.env'}))

import { ExaSearchResults } from "@langchain/exa";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import Exa from "exa-js";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
import { JsonOutputParser, StringOutputParser } from "@langchain/core/output_parsers"

async function createAgent(parameters) {
  const tools = [
    new ExaSearchResults({
      searchArgs: {
        type: parameters.type,
        text: {
          maxCharacters: parameters.characters,  // Max characters for text content scraped from each page (tradeoff between finding right answer and using many tokens)
          includeHtmlTags: false, 
        },
        numResults: parameters.pages,
        includeDomains: ['https://patents.google.com/']
      },
      client: new Exa(process.env.EXASEARCH_API_KEY),
    }),
  ];
  
  const instruction = `Given an idea and a usecase search the web for top 3 (only 3) most similar patents and their urls. The output should be in the following json format and the key results:

  json{{
    results: [{{
      name: {{}},
      url: {{}}
    }},
    ...]`
 
const outputParser = new StringOutputParser();

const prompt = ChatPromptTemplate.fromMessages([
  ["system", instruction],
  ["human", "Idea: {idea}\n\nUsecase: {usecase}\n\nOutput:\n\n"],
  ["placeholder", "{agent_scratchpad}"],
]);

// const prompt = await pull(
//   "hwchase17/openai-functions-agent"
// );

const llm = new ChatOpenAI({
  model: "gpt-4o",
  temperature: parameters.temp,
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
  const agentExecutor = await createAgent(body.parameters)
  try {
    const response = await agentExecutor.invoke({
      idea: body.idea,
      usecase: body.usecase
    });
    // console.log(response)
    return outputParser.parse(response.output)
  } catch (error) {
    console.error("Error invoking model:", error);
    return 'Error invoking model'
  }
});