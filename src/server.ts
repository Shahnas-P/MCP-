import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const customers = [
    {
        id: 1,
        name: "Shahnas",
        email: "shahnas@example.com",
        city: "Kochi",
    },
    {
        id: 2,
        name: "Anu",
        email: "anu@example.com",
        city: "Calicut",
    },
    {
        id: 3,
        name: "Rahul",
        email: "rahul@example.com",
        city: "Kochi",
    },
];

const server = new McpServer({
    name: "learning-server",
    version: "1.0.0",
});

server.registerTool(
    "get_customers",
    {
        description: "Get all customers"
    },
    async () => {
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(customers)
                }
            ],
        };
    }
);

server.registerTool(
    "search_customer",
    {
        description: "Search customer by city",
        inputSchema: {
            city: z.string(),
        }
    },
    async ({ city }) => {
        const result = customers.filter((customer) => customer.city.toLocaleLowerCase() === city.toLocaleLowerCase());
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result)
                }
            ]
        }

    }
)

const transport = new StdioServerTransport();

await server.connect(transport);