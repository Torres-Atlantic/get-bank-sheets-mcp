#!/usr/bin/env node

/**
 * CLI entry point for Bank Sheets MCP Server
 */

import { createAndStartMcpServer } from './server'

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2)
  const parsed: Record<string, string> = {}

  for (const arg of args) {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=')
      if (key && value) {
        parsed[key] = value
      }
    }
  }

  return parsed
}

// Main function
async function main() {
  const args = parseArgs()
  
  const apiKey = args['api-key'] || process.env.MCP_API_KEY
  const baseUrl = args['base-url'] || process.env.MCP_BASE_URL || 'https://us-central1-get-bank-sheets.cloudfunctions.net'

  if (!apiKey) {
    console.error('Error: API key is required. Use --api-key=YOUR_API_KEY or set MCP_API_KEY environment variable')
    process.exit(1)
  }

  console.log('Starting Bank Sheets MCP Server...')
  console.log(`API Key: ${apiKey.substring(0, 8)}...`)
  console.log(`Base URL: ${baseUrl}`)

  try {
    const server = await createAndStartMcpServer(apiKey, baseUrl)
    console.log('MCP Server started successfully')
    
    // Test connection
    const isConnected = await server.testConnection()
    if (isConnected) {
      console.log('✅ Successfully connected to Bank Sheets API')
    } else {
      console.log('⚠️  Warning: Could not connect to Bank Sheets API')
    }
    
    // Keep the process running
    process.on('SIGINT', () => {
      console.log('\nShutting down MCP Server...')
      process.exit(0)
    })
  } catch (error) {
    console.error('Failed to start MCP server:', error)
    process.exit(1)
  }
}

// Run the main function
main().catch((error) => {
  console.error('Unhandled error:', error)
  process.exit(1)
})
