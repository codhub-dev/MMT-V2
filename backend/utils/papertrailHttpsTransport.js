const Transport = require("winston-transport");
const axios = require("axios");

class PapertrailHTTPSTransport extends Transport {
  constructor(opts) {
    super(opts);

    this.endpoint = opts.endpoint;
    this.token = opts.token;
  }

  async log(info, callback) {
    setImmediate(() => this.emit("logged", info));

    try {
      await axios.post(
        this.endpoint,
        {
          message: info.message,
          level: info.level,
          timestamp: new Date().toISOString(),
          meta: info.meta || {}
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`
          }
        }
      );
    } catch (err) {
      // Silently ignore Papertrail HTTPS errors to prevent console clutter
      // The logger will handle critical errors through its own error handling
    }

    callback();
  }
}

module.exports = PapertrailHTTPSTransport;
