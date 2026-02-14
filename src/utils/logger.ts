/**
 * Logger utility
 */

import { createLogger, format, transports } from 'winston';

const {
  combine,
  timestamp,
  printf,
  colorize
} = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

export const logger = createLogger({
  level: 'info',
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    myFormat
  ),
  transports: [
    new transports.Console()
  ]
});
