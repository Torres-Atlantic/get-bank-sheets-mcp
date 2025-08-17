export interface McpTool {
  name: string
  description: string
  inputSchema: {
    type: string
    properties: Record<string, any>
    required?: string[]
  }
  requiredPermissions: string[]
}

export interface McpResource {
  uri: string
  name: string
  description: string
  mimeType: string
  requiredPermissions: string[]
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export interface Transaction {
  id: string
  accountId: string
  amount: number
  date: string
  name: string
  category?: string[]
  pending: boolean
  merchantName?: string
  paymentChannel?: string
  personalFinanceCategory?: any
}

export interface BankAccount {
  accountId: string
  accountName: string
  accountNumber: string
  accountType: string
  accountSubtype: string
  institutionName: string
}

export interface Spreadsheet {
  id: string
  name: string
  createdAt: string
  isActive: boolean
}

export interface ApiKey {
  id: string
  name: string
  permissions: string[]
  createdAt: string
  lastUsed?: string
  isActive: boolean
}

export interface UsageStats {
  dailyUsed: number
  dailyLimit: number
  dailyRemaining: number
  minuteUsed: number
  minuteLimit: number
  minuteRemaining: number
  dailyReset: string
  minuteReset: string
}

export interface AccountStatus {
  plaidConnected: boolean
  googleSheetsConnected: boolean
  apiAccessEnabled: boolean
  subscriptionStatus?: string
  bankAccountsCount: number
  activeSpreadsheetsCount: number
}
