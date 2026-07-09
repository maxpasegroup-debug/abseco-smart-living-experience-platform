type LogLevel = "info" | "warn" | "error" | "security" | "audit";

type LogContext = Record<string, unknown>;

function write(level: LogLevel, message: string, context: LogContext = {}) {
  const entry = {
    level,
    message,
    context,
    timestamp: new Date().toISOString()
  };
  const line = JSON.stringify(entry);
  if (level === "error" || level === "security") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }
}

export const logger = {
  info: (message: string, context?: LogContext) => write("info", message, context),
  warn: (message: string, context?: LogContext) => write("warn", message, context),
  error: (message: string, context?: LogContext) => write("error", message, context),
  security: (message: string, context?: LogContext) => write("security", message, context),
  audit: (message: string, context?: LogContext) => write("audit", message, context)
};
