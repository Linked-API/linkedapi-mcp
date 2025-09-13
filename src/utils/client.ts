export function deriveClientFromUserAgent(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes('cursor')) return 'cursor';
  if (ua.includes('windsurf')) return 'windsurf';
  if (ua.includes('vscode') || ua.includes('visual studio code')) return 'vscode';
  if (ua.includes('chatgpt') || ua.includes('openai')) return 'chatgpt';
  if (ua.includes('curl')) return 'curl';
  if (ua.includes('postman')) return 'postman';
  if (
    ua.includes('mozilla') ||
    ua.includes('chrome') ||
    ua.includes('safari') ||
    ua.includes('firefox')
  )
    return 'browser';
  return userAgent;
}
