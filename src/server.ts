import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import { BankSheetsApiClient } from './api-client'
import { MCP_TOOLS, executeTool } from './tools'
import { MCP_RESOURCES } from './resources'

export class BanksheetsMcpServer {
  private server: Server
  private apiClient: BankSheetsApiClient

  constructor(apiKey: string, baseUrl?: string) {
    this.apiClient = new BankSheetsApiClient(apiKey, baseUrl)

    // Create server with stdio transport
    this.server = new Server(
      {
        name: 'banksheets-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    )

    // Set up request handlers
    this.setupHandlers()
  }

  private setupHandlers() {
    // Handle list tools request
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: MCP_TOOLS.map((tool) => ({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
        })),
      }
    })

    // Handle call tool request
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params

      const tool = MCP_TOOLS.find((t) => t.name === name)
      if (!tool) {
        throw new Error(`Tool '${name}' not found`)
      }

      // Execute tool
      const result = await executeTool(name, args, this.apiClient)
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    })

    // Handle list resources request
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: MCP_RESOURCES.map((resource) => ({
          uri: resource.uri,
          name: resource.name,
          description: resource.description,
          mimeType: resource.mimeType,
        })),
      }
    })

    // Handle read resource request
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params

      const resource = MCP_RESOURCES.find((r) => r.uri === uri)
      if (!resource) {
        throw new Error(`Resource '${uri}' not found`)
      }

      // Get resource data
      const data = await this.getResource(uri)
      return {
        contents: [
          {
            uri,
            mimeType: resource.mimeType,
            text: JSON.stringify(data, null, 2),
          },
        ],
      }
    })
  }

  // Start the server
  async start() {
    const transport = new StdioServerTransport()
    await this.server.connect(transport)
    console.log('Bank Sheets MCP Server started')
  }

  // Resource retrieval methods
  private async getResource(uri: string): Promise<any> {
    switch (uri) {
      case 'bank-accounts':
        return await this.apiClient.getAccounts()
      case 'transactions':
        return await this.apiClient.getTransactions({
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          accountId: 'default', // This would need to be handled differently
          limit: 50,
        })
      case 'api-keys':
        return { apiKeys: await this.apiClient.listMyApiKeys() }
      case 'usage-stats':
        return await this.apiClient.viewUsageStats()
      case 'spreadsheets':
        return await this.apiClient.getSheets()
      case 'account-status':
        return await this.apiClient.checkAccountStatus()
      default:
        throw new Error(`Resource '${uri}' not implemented`)
    }
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    return await this.apiClient.testConnection()
  }
}

// Helper function to create and start MCP server
export async function createAndStartMcpServer(
  apiKey: string,
  baseUrl?: string
): Promise<BanksheetsMcpServer> {
  const server = new BanksheetsMcpServer(apiKey, baseUrl)
  await server.start()
  return server
}
