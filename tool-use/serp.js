// Import env variables
import * as dotenv from 'dotenv'
dotenv.config(({path : '../.env'}))

import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { pull } from "langchain/hub";
// Agent tools
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
// Search Tools
import { SerpAPI } from "@langchain/community/tools/serpapi";


const searchTool = new SerpAPI({
  hl: 'en',
  gl: 'us',
  num: 1
})

const tools = [
  searchTool
]
const prompt = await pull(
  "hwchase17/openai-functions-agent"
);

const llm = new ChatOpenAI({model:'gpt-4o'
});

const agent = await createOpenAIToolsAgent({
  llm,
  tools,
  prompt,
});

const agentExecutor = new AgentExecutor({
  agent,
  tools,
  verbose: false,
});

const result2 = await agentExecutor.invoke({
  input: "Return the name of the first author of the Eevee annotation tool for natural language processing?",
});

console.log(result2);

