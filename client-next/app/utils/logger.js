/**
 * Simple logger utility for client‑side debugging.
 * Logs are printed to the console with timestamps and also stored in
 * `window.__speechDebugLog` (an array) so you can inspect them via the
 * browser console.
 */
export const log = (level, message, ...optionalParams) => {
  const timestamp = new Date().toISOString();
  const formatted = `[${timestamp}] [${level}] ${message}`;
  // eslint-disable-next-line no-console
  console.log(formatted, ...optionalParams);
  if (typeof window !== 'undefined') {
    window.__speechDebugLog = window.__speechDebugLog || [];
    window.__speechDebugLog.push({ timestamp, level, message, optionalParams });
  }
};

export const logInfo = (msg, ...args) => log('INFO', msg, ...args);
export const logError = (msg, ...args) => log('ERROR', msg, ...args);
