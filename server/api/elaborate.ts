
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser, StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatOpenAI({model:'gpt-4o'
, maxTokens: 600});

const instruction = `Given a high level description of a usecase and a description of an idea, explain in detail the painpoints and limitations of current methods, how the idea could improve these problems and what business opportunities the usecase provides. Be concrete and do not repeat information that has already been stated. IMPORTANT: Your responses should be plain text without formatting. Max 500 tokens.`;


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