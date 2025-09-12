export function defineRequestTimeoutInSeconds(mcpClient: string): number {
  const bigTimeout = 600;

  console.error('mcpClient', mcpClient);
  switch (mcpClient) {
    case 'claude':
      return 180;
    case 'chatgpt':
      return 50;
    case 'cursor':
    case 'vscode':
    case 'windsurf':
      return bigTimeout;
    default:
      return 60;
  }
}
