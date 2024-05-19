
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser, StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatOpenAI({model:'gpt-4o'
, maxTokens: 100});

const instruction = `Given a short description of an idea/patent/product, return the most relevant market.

Description: EcoCharge is a portable, solar-powered battery pack for outdoor enthusiasts, offering high-capacity storage, fast charging, and a durable, water-resistant design.

Output: Outdoor Recreation Equipment
`;


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
    return output;
  } catch (error) {
    console.error("Error invoking model:", error);
    return 'Error invoking model'
  }
});