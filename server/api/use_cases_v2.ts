
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate, FewShotChatMessagePromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser, StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatOpenAI({model:'gpt-4o'
, maxTokens: 2000, temperature: 0, modelKwargs: {
  "response_format": { 
    type: "json_object" 
  }}});


const instruction = `You are a business intelligence assistant. Given a description of a idea, find 5 different markets where the idea will provide an edge or improvement over previous methods. The format of the output should be json with main key 'usecases' and with title of market and description. The description should describe specifically how the idea is better than what is currently being used. Explain in detail why the application of the idea is better than previous alternatives.`

// const instruction = `	
// You are a business intelligence assistant. Your task is to explore and identify five specific and unexplored use cases for a given patent. The patent description will be provided, and you need to find relevant use cases.

// Task Requirements:
// Identify five unexplored use cases where this patent can be applied.
// Ensure that the use cases are specific and practical.

// The format of the output should be json with main key 'usecases' and with short title and description. Add <b> html tags around important words in each description to make them stand out. Don't use markdown (like ** or ##)

// For each usecase increasingly focus on more innovative and emerging areas where this technology has not been widely adopted yet. Max 800 tokens.
// `;

const prompt = ChatPromptTemplate.fromMessages([
  ["system", instruction],
  ["human", "Description: {description}\n\nOutput: "],
]);

const outputParser = new JsonOutputParser();

const llmChain = prompt.pipe(llm).pipe(outputParser);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    const output = await llmChain.invoke({
      description: body.description
    });
    console.log(output)
    return output;
  } catch (error) {
    console.error("Error invoking model:", error);
    return 'Error invoking model'
  }
});