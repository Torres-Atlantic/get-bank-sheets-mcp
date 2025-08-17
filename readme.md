# @banksheets/mcp-server

MCP (Model Context Protocol) server for Bank Sheets - access financial data through AI assistants.

## Installation

```bash
npm install @banksheets/mcp-server
```

## Usage

### Command Line

```bash
# Using command line arguments
npx banksheets-mcp --api-key=YOUR_API_KEY

# Using environment variables
export MCP_API_KEY=your_api_key
npx banksheets-mcp
```

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "bank-sheets": {
      "command": "npx",
      "args": ["@banksheets/mcp-server"],
      "env": {
        "MCP_API_KEY": "your_api_key"
      }
    }
  }
}
```

## Available Tools

- `list_my_api_keys` - List API keys
- `check_account_status` - Check connection status
- `view_usage_stats` - View usage statistics
- `get_transactions` - Get bank transactions
- `get_accounts` - Get bank accounts
- `get_spreadsheets` - Get spreadsheets
- `generate_api_key` - Generate new API key

## Available Resources

- `bank-accounts` - Bank account data
- `transactions` - Transaction data
- `api-keys` - API key management
- `usage-stats` - Usage statistics
- `spreadsheets` - Spreadsheet data
- `account-status` - Connection status

## Prerequisites

1. Bank Sheets account with connected bank
2. API access subscription
3. API key with appropriate permissions

## Security

- No direct database access
- Uses your existing REST API
- Maintains all existing security and rate limiting
- API key validation handled server-side

## License

MIT

## TODO

### Publishing Steps

1. **Test with real API key**
   ```bash
   export MCP_API_KEY=your_real_api_key
   npm test
   ```

2. **Login to npm (if not already logged in)**
   ```bash
   npm login
   ```

3. **Publish to npm**
   ```bash
   npm publish --access public
   ```

4. **Update Bank Sheets documentation**
   - Add MCP server installation instructions
   - Include Claude Desktop configuration example
   - Document available tools and resources
   - Add troubleshooting section

5. **Verify installation**
   ```bash
   npm install @banksheets/mcp-server
   npx banksheets-mcp --api-key=test_key
   ```

### Post-Publishing Checklist

- [ ] Test package installation from npm
- [ ] Verify CLI works with real API key
- [ ] Add MCP server to API documentation
- [ ] Create usage examples
- [ ] Monitor for any issues
