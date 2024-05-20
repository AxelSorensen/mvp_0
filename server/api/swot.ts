
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser, StringOutputParser } from "@langchain/core/output_parsers";
import market_stats from "./market_stats";

const llm = new ChatOpenAI({model:'gpt-4o'
, maxTokens: 400, temperature: 0.2, modelKwargs: {
  "response_format": { 
    type: "json_object" 
  }}});

const instruction = `Given a short description of an idea and a json file with the market stats and a usecase, return a relevant a swot analysis in json format.

Description: EcoCharge is a portable, solar-powered battery pack for outdoor enthusiasts, offering high-capacity storage, fast charging, and a durable, water-resistant design.
Market stats:
{{
  "{{relevant_market}}": "{{Outdoor Recreation Equipment}}",
  "{{market_stats}}": {{
    "{{market_size}}": {{
      "{{value}}": "{{US$35.8bn by 2026}}",
      "{{source}}": "{{https://www.marketsandmarkets.com/Market-Reports/outdoor-power-equipment-market-206862770.html}}"
    }},
    "{{CAGR}}": {{
      "{{value}}": "{{5.6%}}",
      "{{source}}": "{{https://articles.abilogic.com/364111/outdoor-clothing-market-expand-cagr.html}}"
    }}
  }},
  "{{dominant_actors}}": {{
    "{{top_3}}": [
      {{
        "{{name}}": "{{EcoFlow}}",
        "{{link}}": "{{https://www.ecoflow.com}}"
      }},
      {{
        "{{name}}": "{{BLUETTI}}",
        "{{link}}": "{{https://www.bluettipower.com/products/bluetti-ac300-b300-modular-power-system}}"
      }},
      {{
        "{{name}}": "{{Goal Zero}}",
        "{{link}}": "{{https://www.goalzero.com/shop/yeti-power-stations}}"
      }}
    ]
  }},
  "{{potential_customers}}": {{
    "{{top_3}}": [
      {{
        "{{name}}": "{{Hikers and Backpackers}}"
      }},
      {{
        "{{name}}": "{{Campers}}"
      }},
      {{
        "{{name}}": "{{Outdoor Sports Enthusiasts}}"
      }}
    ]
  }}
}}
Usecase: EcoCharge is perfect for backpackers who venture into remote wilderness areas for multi-day trips. The solar-powered, high-capacity battery ensures they can charge their GPS devices, smartphones, and other portable electronics on the go. Its fast-charging feature allows for quick energy replenishment during shorter daylight hours, and the durable, water-resistant design protects the battery pack from rain, spills, and rugged terrain.

Output:
json{{
    "Strengths": [
      "High-capacity storage",
      "Fast charging",
      "Durable and water-resistant design",
      "Solar-powered"
    ],
    "Weaknesses": [
      "Dependence on sunlight",
      "Initial cost"
    ],
    "Opportunities": [
      "Growing market",
      "Rising popularity of outdoor activities",
      "Technological advancements"
    ],
    "Threats": [
      "Competition",
      "Economic downturns"
    ]
}}
`;


const prompt = ChatPromptTemplate.fromMessages([
  ["system", instruction],
  ["user", "Description: {description}\nMarket Stats: {market_analysis}\nUsecase: {usecase}\n\nOutput:\n"],
]);

const outputParser = new JsonOutputParser();

const llmChain = prompt.pipe(llm).pipe(outputParser);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    const output = await llmChain.invoke({
      description: body.description,
      market_analysis: body.market_analysis,
      usecase: body.use_case
    });
    // console.log(output)
    return output;
  } catch (error) {
    console.error("Error invoking model:", error);
    return 'Error invoking model'
  }
});