import winston from 'winston';
import path from 'path';
import { env } from '../../config/env';

const logFormat = winston.format.printf(({ level, message, timestamp, requestId, ...metadata }) => {
  const reqIdStr = requestId ? ` [ReqID: ${requestId}]` : '';
  let msg = `[${timestamp}] [${level.toUpperCase()}]${reqIdStr}: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  return msg;
});

const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'requestId'] })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      ),
    }),
  ],
});

if (env.NODE_ENV === 'production') {
  const logDir = path.join(process.cwd(), 'logs');
  logger.add(
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: winston.format.combine(winston.format.json()),
    })
  );
  logger.add(
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      format: winston.format.combine(winston.format.json()),
    })
  );
}

export default logger;
export { logger };
