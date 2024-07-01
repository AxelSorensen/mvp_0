// Import env variables
import * as dotenv from 'dotenv'
dotenv.config(({path : '../.env'}))

import { ExaSearchResults } from "@langchain/exa";
import { TavilySearchResults } from '@langchain/community/tools/tavily_search';
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import Exa from "exa-js";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
import { JsonOutputParser, StringOutputParser } from "@langchain/core/output_parsers"

async function createAgent(parameters) {
  // const searchTool = new TavilySearchResults({maxResults: 5, kwargs: { includeDomains: ['https://www.statista.com/']
  // } })
  // const tools = [
  // searchTool
  // ]
  const tools = [
    new ExaSearchResults({
      searchArgs: {
        type: parameters.type,
        text: {
          maxCharacters: parameters.characters,  // Max characters for text content scraped from each page (tradeoff between finding right answer and using many tokens)
          
          includeHtmlTags: false, 
        },
        numResults: parameters.pages,
      },
      client: new Exa(process.env.EXASEARCH_API_KEY),
    }),
  ];
  
const instruction = `Given a usecase, search the web and put together a detailed market analysis (including market size, saturation, CAGR, gaps, barrier to entry, dominant actors, any important regulations etc.). Don't repeat yourself and remember to specify which market (US, Asia, Europe, Global etc.) the reported numbers belong to. After each sentence provide a link to the source of the information. Links should be formatted as html anchor elements with a reference to the link as follows: [<a class='font-bold' href='url' target="_blank">source</a>] Don't use markdown, or headings (## or **) only plain text. Output should be more or less 400 tokens.`

const prompt = ChatPromptTemplate.fromMessages([
  ["system", instruction],
  ["human", "Usecase: {usecase}\n\nOutput:\n\n"],
  ["placeholder", "{agent_scratchpad}"],
]);

// const prompt = await pull(
//   "hwchase17/openai-functions-agent"
// );

const llm = new ChatOpenAI({
  model: "gpt-4o",
  temperature: parameters.temp,
  maxTokens: 1000
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

const outputParser = new StringOutputParser()


export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const agentExecutor = await createAgent(body.parameters)
  try {
    const response = await agentExecutor.invoke({
      usecase: body.description,
    });
    // console.log(response)
    return outputParser.parse(response.output)
  } catch (error) {
    console.error("Error invoking model:", error);
    return 'Error invoking model'
  }
});