
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate, FewShotChatMessagePromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser, StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatOpenAI({model:'gpt-4o'
, maxTokens: 2000, temperature: 0.4, frequencyPenalty: 0.5, modelKwargs: {
  "response_format": { 
    type: "json_object" 
  }}});


// const instruction = `You are a business intelligence assistant. Given a description of a idea, find 5 different markets where the idea will provide an edge or improvement over previous methods. The format of the output should be json with main key 'usecases' and with title of market and description. The description should describe specifically how the idea is better than what is currently being used. Explain in detail why the application of the idea is better than previous alternatives.`

const instruction = `You are a business intelligence assistant. Given a description of a idea, find 5 specific usecases in different markets where the idea could provide an edge or improvement over current methods. The format of the output should be json with main key 'usecases' and with title of usecase and description. The description should describe the current painpoints of this usecase and explain exactly how the idea might improve these problems. Be factual and non-obvious. Describe certain limitations of the usecase that call for the implementation of the idea. Use 200 tokens per usecase. Just plain text, no headers`



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