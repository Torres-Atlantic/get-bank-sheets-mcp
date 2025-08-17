import { McpTool } from './types'
import { BankSheetsApiClient } from './api-client'

export const MCP_TOOLS: McpTool[] = [
  {
    name: 'list_my_api_keys',
    description: 'List all API keys for the authenticated user',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
    requiredPermissions: ['management:read'],
  },
  {
    name: 'check_account_status',
    description: 'Check Plaid and Google Sheets connection status',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
    requiredPermissions: ['management:read'],
  },
  {
    name: 'view_usage_stats',
    description: 'View API usage statistics and limits',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
    requiredPermissions: ['analytics:read'],
  },
  {
    name: 'get_transactions',
    description: 'Get transactions from authorized bank accounts',
    inputSchema: {
      type: 'object',
      properties: {
        startDate: {
          type: 'string',
          description: 'Start date in YYYY-MM-DD format',
        },
        endDate: {
          type: 'string',
          description: 'End date in YYYY-MM-DD format (optional, defaults to today)',
        },
        accountId: {
          type: 'string',
          description: 'Bank account ID',
        },
        limit: {
          type: 'number',
          description: 'Number of transactions to return (1-100, default 50)',
        },
      },
      required: ['startDate', 'accountId'],
    },
    requiredPermissions: ['data:read'],
  },
  {
    name: 'get_accounts',
    description: 'Get list of authorized bank accounts',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
    requiredPermissions: ['data:read'],
  },
  {
    name: 'get_spreadsheets',
    description: 'Get list of user\'s Google Sheets spreadsheets',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
    requiredPermissions: ['data:read'],
  },
  {
    name: 'generate_api_key',
    description: 'Generate a new API key with specified permissions',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name for the API key',
        },
        permissions: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['data:read', 'data:write', 'management:read', 'management:write', 'analytics:read', 'mcp:access']
          },
          description: 'Permissions to grant to the API key',
        },
      },
      required: ['name'],
    },
    requiredPermissions: ['management:write'],
  },
]

export async function executeTool(
  toolName: string,
  args: any,
  apiClient: BankSheetsApiClient
): Promise<any> {
  switch (toolName) {
    case 'list_my_api_keys':
      return { apiKeys: await apiClient.listMyApiKeys() }
    case 'check_account_status':
      return await apiClient.checkAccountStatus()
    case 'view_usage_stats':
      return await apiClient.viewUsageStats()
    case 'get_transactions':
      return await apiClient.getTransactions(args)
    case 'get_accounts':
      return await apiClient.getAccounts()
    case 'get_spreadsheets':
      return await apiClient.getSheets()
    case 'generate_api_key':
      return await apiClient.generateNewApiKey(args.name, args.permissions)
    default:
      throw new Error(`Tool '${toolName}' not implemented`)
  }
}
