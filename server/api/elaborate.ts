
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser, StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatOpenAI({model:'gpt-4o'
, maxTokens: 400});

const instruction = `Given a high level description of a usecase, go more in to depth about exactly what the usecase entails. Max 300 tokens`;


const prompt = ChatPromptTemplate.fromMessages([
  ["system", instruction],
  ["user", "Description: {description}\n\nOutput: "],
]);

const outputParser = new StringOutputParser();

const llmChain = prompt.pipe(llm).pipe(outputParser);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    const output = await llmChain.invoke({
      description: body.description
    });
    // console.log(output)
    return output;
  } catch (error) {
    console.error("Error invoking model:", error);
    return 'Error invoking model'
  }
});