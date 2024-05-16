
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const chatModel = new ChatOpenAI({model:'gpt-4o'
});

const instruction = `Given the name and a short description of an invention, your job is to answer the two following questions:

Q1: Describe a use-case (or related use-cases) which builds on the inventions/technology's unique characteristics and advantages.

Q2: What problem(s) does it solve and why might this be more desirable than the existing solutions?

You may strictly only use 100 words, so keep it short
`;


const prompt = ChatPromptTemplate.fromMessages([
  ["system", instruction],
  ["user", "Name: {name} \n Description: {description}"],
]);

const outputParser = new StringOutputParser();

const llmChain = prompt.pipe(chatModel).pipe(outputParser);


export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return {
    output: await llmChain.invoke({
      name: body.name,
      description: body.description
  })
  }
})