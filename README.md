Linked API MCP server connects your LinkedIn account to AI assistants like Claude, Cursor, and VS Code. Ask them to search for leads, send messages, analyze profiles, and much more – they'll handle it through our cloud browser, safely and automatically.

# Use cases
- **Sales automation assistant**. Ask your AI to find leads, check their profiles, and draft personalized outreach. It can search for "software engineers at companies with 50-200 employees in San Francisco", analyze their backgrounds, and suggest connection messages that actually make sense.
- **Recruitment assistant**. Let your assistant search for candidates with specific skills, review their experience, and send initial outreach. It handles the time-consuming parts while you focus on actually talking to people.
- **Conversation assistant**. Your AI can read your existing LinkedIn conversations and help you respond naturally. It understands the context of your chats, suggests relevant replies, and can even send follow-up messages.
- **Market research assistant**. Need competitor analysis? Your assistant can gather data about companies, their employees, and recent activities. Get insights about industry trends without spending hours on LinkedIn.

# Installation
The MCP server needs tokens to access your LinkedIn account. Here's how to get them:

1. Sign up at [Linked API Platform](https://app.linkedapi.io/?ref=github-mcp).
2. Choose your plan and complete the purchase.
3. Connect your LinkedIn account (it takes about 2 minutes).
4. Copy your tokens from the dashboard:
    - `LINKED_API_TOKEN` – your main token that enables Linked API access.
    - `IDENTIFICATION_TOKEN` – unique token for your LinkedIn account.
  
**Multiple LinkedIn accounts:**

If you have multiple LinkedIn accounts, you'll get a separate identification token for each one, and you can create multiple MCP server instances – one for each account.

**Handling long-running workflows:**

The configuration examples below include a `HEALTH_CHECK_PERIOD` variable. Different applications (Claude, VS Code, Cursor, Windsurf) have different timeout limits for MCP tool calls. Since some LinkedIn workflows can take several minutes to complete, this setting helps the MCP server handle these longer operations correctly – preventing disconnections and ensuring your workflows run to completion.

## Claude

Add this to your Claude Desktop configuration file:

- Mac: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

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
Restart Claude Desktop after saving the config.

## Cursor
Add this configuration to your Cursor settings:
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
You can also configure it through the UI: go to Cursor Settings > Tools & Integrations > MCP Tools Section, then click "New MCP Server" and paste the configuration.

## VS Code
Install the MCP extension, then add this to your settings:
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

## Windsurf
Add this to your Windsurf configuration file at `~/.codeium/windsurf/mcp_config.json`:

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
You can also configure it through the UI: go to Windsurf Settings > Advanced Settings > Cascade section, then click "Add Server" and paste the configuration.

# Available tools
The MCP server provides these tools for interacting with LinkedIn:

## Standard interface
| **Tool** | **Description** |
|:---------|----------:|
| `fetch_person` | Get person page information with optional experience, education, skills, posts | 
| `fetch_company` |  Get company information with optional employees, decision makers, posts | 
| `fetch_post` |  Get post information and engagement metrics |
| `search_people` |  Search for people with advanced filtering |
| `search_companies` |  Search for companies with advanced filtering |
| `send_message` |  Send message to person |
| `sync_conversation` |  Sync conversation for polling |
| `send_connection_request` |  Send connection request with optional note |
| `check_connection_status` |  Check connection status with person |
| `withdraw_connection_request` |  Withdraw pending connection request |
| `retrieve_pending_requests` |  Get all pending connection requests |
| `retrieve_connections` |  Get your connections with filtering |
| `remove_connection` |  Remove person from connections |
| `react_to_post` |  React to post (like, love, support, celebrate, insightful, funny) |
| `comment_on_post` |  Leave comment on post |
| `retrieve_performance` |  Get LinkedIn dashboard analytics |
| `get_api_usage_stats` |  Get Linked API usage statistics |

## Sales Navigator
| **Tool** | **Description** |
|:---------|----------:|
| `nv_fetch_person` | Get person page information from Sales Navigator | 
| `nv_fetch_company` |  Get company information with optional employees and decision makers from Sales Navigator | 
| `nv_search_people` |  Search for people with advanced filtering via Sales Navigator |
| `nv_search_companies` |  Search for companies with advanced filtering via Sales Navigator |
| `nv_send_message` |  Send message to person via Sales Navigator |
| `nv_sync_conversation` |  Sync Sales Navigator conversation for polling |

## Other tools
| **Tool** | **Description** |
|:---------|----------:|
| `poll_conversations` |  Monitor Standard and Sales Navigator conversations for new messages |
| `execute_custom_workflow` |  Execute custom workflow definition | 
| `get_workflow_result` |  Get workflow result by ID |

# Usage examples
With Linked API MCP, you can ask your AI-assistant things like:
> [!TIP]
> Find all decision makers at Acme Corp and send them connection requests.

> [!TIP]
> Search for product managers at fintech companies in New York with 50-200 employees.

> [!TIP]
> Tell me about 'https[]()://linkedin.com/in/jane-doe' including their work history and experience.

> [!TIP]
> Send a connection request to 'https[]()://linkedin.com/in/jane-doe' mentioning their recent article about AI in healthcare.

> [!TIP]
> Get all my pending connection requests and withdraw each one of them.

These are just basic examples. Since your assistant can execute custom workflows combining multiple actions, the automation potential is truly limitless.

