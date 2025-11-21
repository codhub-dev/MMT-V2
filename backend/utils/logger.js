const winston = require('winston');

// Console transport configuration
const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  )
});

// Create logger instance with console transport only
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    consoleTransport
  ]
});

// Only enable Papertrail if explicitly configured via environment variable
if (process.env.ENABLE_PAPERTRAIL === 'true') {
  const PapertrailHTTPSTransport = require('./papertrailHttpsTransport');
  
  // Papertrail HTTPS transport configuration
  const papertrailTransport = new PapertrailHTTPSTransport({
    endpoint: process.env.PAPERTRAIL_HTTPS_ENDPOINT,
    token: process.env.PAPERTRAIL_TOKEN
  });

  papertrailTransport.on('error', (err) => {
    // Silently fail - don't log verbose errors
  });

  // Try to add Papertrail transport, but don't crash if it fails
  try {
    logger.add(papertrailTransport);
    console.log('Papertrail HTTPS transport added successfully');
  } catch (err) {
    // Silently fail
  }
}

module.exports = logger;
