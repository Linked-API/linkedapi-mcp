# Linked API MCP Server

Model Context Protocol (MCP) server for [Linked API](https://linkedapi.io).

## Installation

### Get API Tokens

1. Sign up at [Linked API](https://app.linkedapi.io?ref=linkedapi-mcp)
2. Get your **LINKED_API_TOKEN** and **IDENTIFICATION_TOKEN** from the dashboard

### Workflow Behavior

Linked API workflows can take over 5 minutes to complete, which might cause the MCP client to disconnect before the results are ready. To address this, each tool invocation includes a `HEALTH_CHECK_PERIOD`— timeout setting in seconds, defaulting to 60 seconds. Once this period elapses, the MCP server will provide a response instructions for workflow restoration.

You can find recommended `HEALTH_CHECK_PERIOD` values for different MCP clients in examples below.

### Claude Desktop

```json
{
  "mcpServers": {
    "linkedapi": {
      "command": "npx",
      "args": ["-y", "linkedapi-mcp@latest"],
      "env": {
        "LINKED_API_TOKEN": "your-linked-api-token-here",
        "IDENTIFICATION_TOKEN": "your-identification-token-here",
        "HEALTH_CHECK_PERIOD": "180"
      }
    }
  }
}
```

### Cursor

```json
{
  "mcpServers": {
    "linkedapi": {
      "command": "npx",
      "args": ["-y", "linkedapi-mcp@latest"],
      "env": {
        "LINKED_API_TOKEN": "your-linked-api-token-here",
        "IDENTIFICATION_TOKEN": "your-identification-token-here",
        "HEALTH_CHECK_PERIOD": "600"
      }
    }
  }
}
```

## Example Usage

After setup, you can ask Claude or Cursor:

> "Find software engineers at Google in San Francisco"

> "Get the profile information for linkedin.com/in/john-doe"

> "Send a connection request to this person with a personalized note"


<details>
<summary><b>Available Tools</b></summary>

Standard tools:
- `fetch_person` - Get LinkedIn profile information with optional experience, education, skills, posts
- `fetch_company` - Get company information with optional employees, decision makers, posts
- `fetch_post` - Get post data and engagement metrics
- `search_people` - Search for people with advanced filtering
- `search_companies` - Search for companies with advanced filtering
- `send_message` - Send direct messages to connections
- `sync_conversation` - Sync conversation for polling
- `poll_conversations` - Monitor multiple conversations for new messages
- `send_connection_request` - Send connection requests with optional notes
- `check_connection_status` - Check connection status with someone
- `withdraw_connection_request` - Withdraw pending connection requests
- `retrieve_pending_requests` - Get all pending connection requests
- `retrieve_connections` - Get your connections with filtering
- `remove_connection` - Remove someone from connections
- `react_to_post` - React to posts (like, love, support, celebrate, insightful, funny)
- `comment_on_post` - Leave comments on posts
- `retrieve_ssi` - Get your Social Selling Index score
- `retrieve_performance` - Get LinkedIn dashboard analytics
- `get_api_usage_stats` - Get Linked API usage statistics

Sales Navigator tools
- `nv_search_people` - Advanced people search with Sales Navigator filters
- `nv_search_companies` - Advanced company search with revenue filters
- `nv_fetch_person` - Get enhanced person data via Sales Navigator
- `nv_fetch_company` - Get enhanced company data with employees and decision makers
- `nv_send_message` - Send InMail messages with subject lines
- `nv_sync_conversation` - Sync Sales Navigator conversations

Advanced tools
- `execute_custom_workflow` - Execute custom workflow definitions
- `get_workflow_result` - Get workflow results by ID
- `restore_workflow` - Restores workflow after timeout or shut down

</details>

## Troubleshooting

- Restart Claude Desktop/Cursor after configuration changes
- Verify your API tokens are valid at [Linked API Dashboard](https://app.linkedapi.io)
- Check that the configuration file syntax is correct

## License

MIT