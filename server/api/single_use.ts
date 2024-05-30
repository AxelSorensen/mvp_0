
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser, StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatOpenAI({model:'gpt-4o'
, maxTokens: 200});

const instruction = `Given a short description of an idea/patent/product, return a non-obvious relevant usecase. Put <b></b> html tags around as many words as you deem important.

Description: EcoCharge is a portable, solar-powered battery pack for outdoor enthusiasts, offering high-capacity storage, fast charging, and a durable, water-resistant design.

Output:
EcoCharge is ideal for <b>wildlife photographers</b> who spend extended periods in remote areas. Its solar-powered, fast-charging capability <b>keeps cameras and drones operational</b>, while its durable, water-resistant design withstands harsh field conditions. This ensures <b>uninterrupted work</b>, capturing wildlife moments without worrying about power shortages.
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
    // console.log(output)
    return output;
  } catch (error) {
    console.error("Error invoking model:", error);
    return 'Error invoking model'
  }
});