import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  {
    name: "typescript-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "hello_world",
      description: "Says hello to the user",
      inputSchema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Name of the person to greet",
          },
        },
        required: ["name"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "hello_world") {
    const name = (request.params.arguments as { name: string }).name || "World";
    return {
      content: [
        {
          type: "text",
          text: `Hello, ${name}! Welcome to your TypeScript MCP server.`,
        },
      ],
    };
  }
  throw new Error(`Unknown tool: ${request.params.name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("TypeScript MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error in main():", error);
  process.exit(1);
});
