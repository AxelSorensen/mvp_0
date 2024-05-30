
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate, FewShotChatMessagePromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser, StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatOpenAI({model:'gpt-4o'
, maxTokens: 1000, temperature: 0.8, modelKwargs: {
  "response_format": { 
    type: "json_object" 
  }}});

const instruction = `	
Act as a skilled business development professional. Given a short description of a patent or idea, return 5 relevant usecases. The usecases should be novel, non-obvious and not mentioned in the description. The format of the output should be json with short title and description (max 200 tokens) and a novelty score (between 1 and 5) of each usecase. Add <b> html tags around important words in each description to make them stand out.
`;

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
    // console.log(output)
    return output;
  } catch (error) {
    console.error("Error invoking model:", error);
    return 'Error invoking model'
  }
});