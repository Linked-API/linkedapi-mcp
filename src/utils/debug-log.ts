export function debugLog(message: string, data?: unknown) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}]: ${message}`;
  console.error(logMessage);
  if (data) {
    console.error(JSON.stringify(data, null, 2));
  }
}
