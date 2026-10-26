import { Tool } from '@modelcontextprotocol/sdk/types.js';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// ChatGPT cannot take a tool whose inputSchema has anyOf/oneOf at its root, and calls such a tool with
// its arguments wrapped as { value: {...} }. No root combinators are listed any more, but a client
// can keep calling with a tool list it fetched earlier, so a lone `value` object is still unwrapped
// for every tool that does not declare a parameter of that name.
export function unwrapValueEnvelope(args: unknown, inputSchema: Tool['inputSchema']): unknown {
  if (!isRecord(args) || inputSchema.properties?.['value'] !== undefined) {
    return args;
  }

  const { value, ...rest } = args;
  if (Object.keys(rest).length > 0 || !isRecord(value)) {
    return args;
  }

  return value;
}
