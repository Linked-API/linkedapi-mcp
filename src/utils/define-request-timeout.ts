export function defineRequestTimeoutInSeconds(mcpClient: string): number {
  const BIG_TIMEOUT = 600 as const;
  const normalizedMcpClient = mcpClient.trim().toLowerCase();

  switch (normalizedMcpClient) {
    case 'codex':
    case 'codex-cli':
    case 'codex-desktop':
    case 'openai-codex':
      return BIG_TIMEOUT;
    case 'claude-code':
    case 'claude_code':
    case 'claude code':
      return BIG_TIMEOUT;
    case 'claude':
    case 'claude-desktop':
    case 'anthropic':
      return 180;
    case 'chatgpt':
    case 'openai':
      return 50;
    case 'cursor':
    case 'vscode':
    case 'windsurf':
      return BIG_TIMEOUT;
    default:
      return 60;
  }
}
