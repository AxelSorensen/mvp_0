
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import * as dotenv from 'dotenv'

dotenv.config()

const llm = new ChatOpenAI({ model:'gpt-4o'
});

const instruction = `Given the name and a short description of an invention, your job is to answer the two following questions:

Q1: Describe a use-case (or related use-cases) which builds on the inventions/technology's unique characteristics and advantages.

Q2: What problem(s) does it solve and why might this be more desirable than the existing solutions?

You may strictly only use 100 words, so keep it short
`;

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant that answers in 1 sentence, searches the web, and provides sources of where information is from"],
  ["placeholder", "{chat_history}"],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
]);


export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return {
    output: await llmChain.invoke({
      name: body.name,
      description: body.description
  })
  }
})