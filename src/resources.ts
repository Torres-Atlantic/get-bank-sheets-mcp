import { McpResource } from './types'

export const MCP_RESOURCES: McpResource[] = [
  {
    uri: 'bank-accounts',
    name: 'Bank Accounts',
    description: "List of user's authorized bank accounts",
    mimeType: 'application/json',
    requiredPermissions: ['data:read'],
  },
  {
    uri: 'transactions',
    name: 'Transactions',
    description: "User's bank transaction data",
    mimeType: 'application/json',
    requiredPermissions: ['data:read'],
  },
  {
    uri: 'api-keys',
    name: 'API Keys',
    description: "User's API key management information",
    mimeType: 'application/json',
    requiredPermissions: ['management:read'],
  },
  {
    uri: 'usage-stats',
    name: 'Usage Statistics',
    description: 'API usage statistics and limits',
    mimeType: 'application/json',
    requiredPermissions: ['analytics:read'],
  },
  {
    uri: 'spreadsheets',
    name: 'Spreadsheets',
    description: "User's Google Sheets spreadsheets",
    mimeType: 'application/json',
    requiredPermissions: ['data:read'],
  },
  {
    uri: 'account-status',
    name: 'Account Status',
    description: 'Connection status for Plaid and Google Sheets',
    mimeType: 'application/json',
    requiredPermissions: ['management:read'],
  },
]
