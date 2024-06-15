// Import env variables
import * as dotenv from 'dotenv'
dotenv.config(({path : '../.env'}))

import { ExaSearchResults } from "@langchain/exa";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import Exa from "exa-js";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";

// Define the tools the agent will have access to.
const tools = [
  new ExaSearchResults({
    searchArgs: {
      type: 'neural',
      text: {
        maxCharacters: 100,  // Max characters for text content scraped from each page (tradeoff between finding right answer and using many tokens)
        includeHtmlTags: false, 
      },
      numResults: 5,
      includeDomains: ['https://patents.google.com/']
    },
    client: new Exa(process.env.EXASEARCH_API_KEY),
  }),
];

const instruction = `Search the web to find a specific need for this use c`

const prompt = ChatPromptTemplate.fromMessages([
  ["system", instruction],
  ["human", "Idea: {input}\n\nOutput: "],
  ["placeholder", "{agent_scratchpad}"],
]);

// const prompt = await pull(
//   "hwchase17/openai-functions-agent"
// );

const llm = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0.8,
  maxTokens: 200,
  modelKwargs: {
    "response_format": { 
      type: "json_object" 
    }
  }})

const agent = await createOpenAIToolsAgent({
  llm,
  tools,
  prompt,
});

const agentExecutor = new AgentExecutor({
  agent,
  tools,
  returnIntermediateSteps: false,
  verbose: false
});

const result = await agentExecutor.invoke({
  input: 'In certain embodiments a light therapy system (e.g., phototherapy device), such as for treatment of Alzheimer’s disease, depression, dementia, short-term memory, or for improved learning, improved athletic performance or improved performance, is provided where the light system comprises a blue light source that operates at a frequency in the range of 20 to 50 Hz (preferably around 40 Hz), whereby the system enables retinal ganglion cells of a human to be exposed in order to stimulate brain waves (gamma oscillations in the human’s brain).',
});

console.log(result);
