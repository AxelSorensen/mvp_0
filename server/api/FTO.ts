
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser, StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatOpenAI({model:'gpt-4o'
, maxTokens: 200});

const instruction = `You are a business intelligence agent. Given a high level description of a usecase and a description of an idea, return a short and concise freedom to operate analysis based on what already exists. Don't use markdown, or headings (## or **) only plain text. Max 200 tokens. `;


const prompt = ChatPromptTemplate.fromMessages([
  ["system", instruction],
  ["user", "Idea:{idea}\n\nUsecase: {description}\n\n Output: "],
]);

const outputParser = new StringOutputParser();

const llmChain = prompt.pipe(llm).pipe(outputParser);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    const output = await llmChain.invoke({
      description: body.description,
      idea: body.idea

    });
    // console.log(output)
    return output;
  } catch (error) {
    console.error("Error invoking model:", error);
    return 'Error invoking model'
  }
});