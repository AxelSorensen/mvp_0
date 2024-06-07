// Import env variables
import * as dotenv from 'dotenv'
dotenv.config(({path : '../.env'}))
import argsParser from 'args-parser'
// Import tools
import { ExaSearchResults } from "@langchain/exa";
import Exa from "exa-js";
import { SearchApi } from "@langchain/community/tools/searchapi";
import { SerpAPI } from "@langchain/community/tools/serpapi";
import { Serper } from "@langchain/community/tools/serper";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { WebBrowser } from "langchain/tools/webbrowser";
// Chat and Agent functions
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";

const args = argsParser(process.argv);
// Define the tools the agent will have access to.
let searchTool
switch (true) {
  case args.exa:
    searchTool = new ExaSearchResults({
      searchArgs: {
        numResults: 5,
        type: 'keyword'
      },
      client: new Exa(process.env.EXASEARCH_API_KEY),
    })
    break;
  case args.search_api:
    searchTool = new SearchApi({
      engine: "google_patents"
    })
    break;
  case args.serp:
    searchTool = new SerpAPI({
      hl: 'en',
      gl: 'us',
      num: 5
    })
    break;
  case args.serper:
    searchTool = new Serper({num: 10})
    break;
  case args.tavily:
    searchTool = new TavilySearchResults({maxResults: 3 })
    break;
  default:
    "Not valid tool"
    break;
}

const tools = [searchTool]

// Prompt
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant who uses the search tool"],
  ["placeholder", "{chat_history}"],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
]);

const llm = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0.8,
});

const agent = await createOpenAIToolsAgent({
  llm,
  tools,
  prompt,
});

const agentExecutor = new AgentExecutor({
  agent,
  tools,
  returnIntermediateSteps: true,
  verbose: false
});

const result = await agentExecutor.invoke({
  input: "Return the name and link to a patent with a bottle cap",
});

console.log(result);