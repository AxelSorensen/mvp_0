// Import env variables
import * as dotenv from 'dotenv'
dotenv.config(({path : '../.env'}))

import { ExaSearchResults } from "@langchain/exa";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import Exa from "exa-js";
import { pull } from "langchain/hub";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";

// Define the tools the agent will have access to.
const tools = [
  new ExaSearchResults({
    searchArgs: {
      numResults: 5,
    },
    client: new Exa(process.env.EXASEARCH_API_KEY),
  }),
];

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant that answers in 3 sentences, searches the web, and provides sources of where information is from"],
  ["placeholder", "{chat_history}"],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
]);

// const prompt = await pull(
//   "hwchase17/openai-functions-agent"
// );

const llm = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 1,
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
  verbose: false
});

const result = await agentExecutor.invoke({
  input: "What is the name of the first author of the Eevee annotation tool for natural language processing?",
});

console.log(result);
