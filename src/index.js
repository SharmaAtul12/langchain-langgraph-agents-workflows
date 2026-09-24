import "dotenv/config";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { createAgent } from "langchain";
import { ChatOpenAI } from "@langchain/openai";
import { webSearch, visitPage } from "./tools/tool.js";

const agent = createAgent({
  model: new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 }),
  tools: ["webSearch", "visitPage"],
  systemPrompt:
    "You are a helpful assistant. Answer clearly and keep replies short. You have access to the following tools: webSearch, visitPage. Use them when needed.",
});

const rl = readline.createInterface({ input, output });
console.log('Chat agent. Type "exit" to quit.\n');

//! Non-streaming ------------------------------------------>

while (true) {
  const question = await rl.question("You: ");
  if (question.trim().toLowerCase() === "exit") break;

  const result = await agent.invoke({
    messages: [{ role: "user", content: question }],
  });

  console.log("Agent:", result.messages.at(-1)?.content, "\n");
}

//! Streaming ------------------------------------------>

while(true){
  const question = await rl.question("You: ");

  if(question.toLowerCase() === "exit") break;

  const result = await agent.stream(
    {messages:[{role:"human" , content:question}]},
    {streamMode:"messages"},
  );

  process.stdout.write("Agent: ");
  for await (const [token] of result) {
    if (token.type !== "ai" || typeof token.content !== "string") continue;
    process.stdout.write(token.content);
  }
  console.log("\n");
}

rl.close();