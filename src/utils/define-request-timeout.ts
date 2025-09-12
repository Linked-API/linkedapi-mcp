export function defineRequestTimeoutInSeconds(mcpClient: string): number {
  const claudeTimeout = 180;
  const bigTimeout = 600;
  const defaultTimeout = Math.min(claudeTimeout, bigTimeout);

  switch (mcpClient) {
    case 'claude':
      return claudeTimeout;
    case 'cursor':
    case 'vscode':
    case 'windsurf':
      return bigTimeout;
    default:
      return defaultTimeout;
  }
}
