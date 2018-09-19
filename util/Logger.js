var winston = require('winston');
const {
  combine,
  timestamp,
  label,
  printf
} = winston.format;
const DailyRotateFile = require('winston-daily-rotate-file');
const env = process.env.NODE_ENV || 'development';
const os = require('os');
const myFormat = printf(info => {
  return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});


const logger = winston.createLogger({
  format: combine(
    label({
      label: 'IdviceBackend-' + os.hostname()
    }),
    timestamp(),
    myFormat
  ),
  transports: [
    // colorize the output to the console
    new(winston.transports.Console)({
      colorize: true,
      level: env === 'development' ? 'debug' : 'info'
    }),
    new(winston.transports.DailyRotateFile)({
      filename: 'application-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      dirname: 'log',
      level: env === 'development' ? 'debug' : 'info'
    })
  ]
});

module.exports = logger