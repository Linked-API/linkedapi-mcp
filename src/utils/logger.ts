type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const levelPriority: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function getMinLevel(): LogLevel {
  const env = (process.env.LOG_LEVEL || '').toLowerCase();
  if (env === 'debug' || env === 'info' || env === 'warn' || env === 'error') return env;
  return 'info';
}

const minLevel = getMinLevel();

function shouldLog(level: LogLevel): boolean {
  return levelPriority[level] >= levelPriority[minLevel];
}

function toErrorObject(value: unknown) {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
  }
  return undefined;
}

function writeLine(line: string) {
  process.stderr.write(line + '\n');
}

function baseLog(level: LogLevel, arg1?: unknown, arg2?: unknown) {
  if (!shouldLog(level)) return;

  let message: string | undefined;
  let payload: unknown | undefined;

  if (typeof arg1 === 'string' && typeof arg2 === 'undefined') {
    message = arg1;
  } else if (typeof arg2 === 'string') {
    message = arg2;
    if (arg1 && typeof arg1 === 'object') {
      const errObj = toErrorObject(arg1);
      payload = errObj ?? arg1;
    } else if (arg1 instanceof Error) {
      payload = toErrorObject(arg1);
    }
  } else if (arg1 instanceof Error) {
    payload = toErrorObject(arg1);
  } else if (arg1 && typeof arg1 === 'object') {
    payload = arg1 as Record<string, unknown>;
  } else if (typeof arg1 !== 'undefined') {
    message = String(arg1);
  }

  if (typeof message === 'string') {
    writeLine(message);
  }

  if (typeof payload !== 'undefined') {
    try {
      // Pretty-print JSON payload without internal fields like time/level
      const pretty = JSON.stringify(payload, null, 2);
      writeLine(pretty);
    } catch {
      // Fallback to toString if payload is not serializable
      writeLine(String(payload));
    }
  }
}

export const logger = {
  debug: (arg1?: unknown, arg2?: unknown) => baseLog('debug', arg1, arg2),
  info: (arg1?: unknown, arg2?: unknown) => baseLog('info', arg1, arg2),
  warn: (arg1?: unknown, arg2?: unknown) => baseLog('warn', arg1, arg2),
  error: (arg1?: unknown, arg2?: unknown) => baseLog('error', arg1, arg2),
};

export type Logger = typeof logger;
