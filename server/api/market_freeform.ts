
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser, StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatOpenAI({model:'gpt-4o'
, maxTokens: 400});

const instruction = `Given a usecase, provide a detailed market analysis Please include total market size, CAGR and dominant players, if possible. Also, please include references for the data when possible. Don't use markdown just plain text. Max 300 tokens.
`;


const prompt = ChatPromptTemplate.fromMessages([
  ["system", instruction],
  ["user", "Usecase: {description}\n\nOutput: "],
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