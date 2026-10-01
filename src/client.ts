import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { GoogleGenAI, Type } from "@google/genai";


const client = new Client({
    version: "1.0.0",
    name: "learning-client",
});


const transport = new StdioClientTransport({
    command: process.execPath,
    args: ["./node_modules/tsx/dist/cli.mjs", "src/server.ts"],
});

await client.connect(transport);

console.log("MCP Server connected");

const tools = await client.listTools();
console.log("Tools", tools.tools);


const geminiTools = [
    {
        functionDeclarations: tools.tools.map((tool) => ({
            name: tool.name,
            description: tool.description ?? "",
            parameters: {
                type: Type.OBJECT,
                properties: tool.inputSchema?.properties ?? {},
                required: tool.inputSchema?.required ?? [],
            }
        }))
    }
]

// Gemini connect

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: "Show me customers from Kochi",
    config: {
        tools: geminiTools
    },
});

// console.dir(response.functionCalls, { depth: null });

const functionCall = response.functionCalls?.[0]

if (!functionCall || !functionCall.name) {
    console.log("Gemini did not request a tool.");
    process.exit(0);
}


const result = await client.callTool({
    name: functionCall.name,
    arguments: functionCall.args,
});

console.log("MCP Tool Result:");
console.dir(result, { depth: null });

// const result = await client.callTool({
//     name: "get_customers",
//     arguments: {}
// });

// const result = await client.callTool({
//     name: "search_customer",
//     arguments: { city: "Kochi" }
// });

// console.log("Tool Result:", result);

