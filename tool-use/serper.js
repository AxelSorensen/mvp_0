// Import env variables
import * as dotenv from 'dotenv'
dotenv.config(({path : '../.env'}))

import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { pull } from "langchain/hub";
// Agent tools
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
// Search Tools
import { Serper } from "@langchain/community/tools/serper";


const searchTool = new Serper({num: 10})

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

const result = await agentExecutor.invoke({
  input: "What is the weather in Copenhagen",
});

console.log(result);
