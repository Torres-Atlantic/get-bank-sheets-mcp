import axios, { AxiosInstance } from 'axios'
import { ApiKey, AccountStatus, UsageStats, Transaction, BankAccount, Spreadsheet } from './types'

export class BankSheetsApiClient {
  private client: AxiosInstance
  private apiKey: string
  private baseUrl: string

  constructor(apiKey: string, baseUrl: string = 'https://us-central1-get-bank-sheets.cloudfunctions.net') {
    this.apiKey = apiKey
    this.baseUrl = baseUrl
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    })

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          throw new Error('Invalid API key')
        }
        if (error.response?.status === 403) {
          throw new Error('Insufficient permissions')
        }
        if (error.response?.status === 429) {
          throw new Error('Rate limit exceeded')
        }
        throw new Error(`API request failed: ${error.message}`)
      }
    )
  }

  // MCP API endpoints
  async listMyApiKeys(): Promise<ApiKey[]> {
    const response = await this.client.get('/api/mcp/listMyApiKeys')
    return response.data.apiKeys
  }

  async checkAccountStatus(): Promise<AccountStatus> {
    const response = await this.client.get('/api/mcp/checkAccountStatus')
    return response.data
  }

  async viewUsageStats(): Promise<UsageStats> {
    const response = await this.client.get('/api/mcp/viewUsageStats')
    return response.data
  }

  async generateNewApiKey(name: string, permissions?: string[]): Promise<ApiKey> {
    const response = await this.client.post('/api/mcp/generateNewApiKey', {
      name,
      permissions,
    })
    return response.data
  }

  // REST API endpoints
  async getTransactions(params: {
    startDate: string
    endDate?: string
    accountId: string
    limit?: number
  }): Promise<{ transactions: Transaction[]; total: number; hasMore: boolean }> {
    const response = await this.client.get('/api/transactions', { params })
    return response.data
  }

  async getAccounts(): Promise<{ accounts: BankAccount[]; total: number }> {
    const response = await this.client.get('/api/accounts')
    return response.data
  }

  async getSheets(): Promise<{ sheets: Spreadsheet[]; total: number }> {
    const response = await this.client.get('/api/sheets')
    return response.data
  }

  // Helper method to test API connection
  async testConnection(): Promise<boolean> {
    try {
      await this.checkAccountStatus()
      return true
    } catch (error) {
      return false
    }
  }
}
